import pool from "@/configs/NilePostgresConfig";

export async function POST(request: Request) {
    let client;
    
    try {
        const { name, email, image } = await request.json();
        
        if (!name || !email) {
            return Response.json(
                { error: "Name and email are required" }, 
                { status: 400 }
            );
        }

        console.log('Attempting to connect to database...');
        client = await pool.connect();
        console.log('Connected to database successfully');

        const tableCheckQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users'
            );
        `;
        
        const tableExists = await client.query(tableCheckQuery);
        
        if (!tableExists.rows[0].exists) {
            console.log('Creating USERS table...');
            await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) UNIQUE NOT NULL,
                    image TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            console.log('USERS table created successfully');
        }
        
        console.log('Inserting user:', { name, email, image: image || 'no image' });
        const result = await client.query(
            'INSERT INTO users (name, email, image) VALUES ($1, $2, $3) RETURNING *',
            [name, email, image || '']
        );
        
        console.log('User inserted successfully:', result.rows[0]);
        
        return Response.json({ 
            success: true, 
            user: result.rows[0],
            message: "User created successfully" 
        });
        
    } catch (error: any) {
        console.error('Database error:', error);
        console.error('Error code:', error.code);
        console.error('Error detail:', error.detail);
        
        if (error.code === '23505') {
            return Response.json(
                { error: "User with this email already exists" }, 
                { status: 409 }
            );
        }
        
        if (error.code === 'ECONNREFUSED') {
            return Response.json(
                { error: "Database connection refused" }, 
                { status: 503 }
            );
        }
        
        return Response.json(
            { 
                error: "Failed to create user", 
                details: error.message,
                code: error.code 
            }, 
            { status: 500 }
        );
        
    } finally {
        if (client) {
            client.release();
            
            console.log('Database connection released');
        }
    }
}