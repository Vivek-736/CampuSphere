import pool from "@/configs/NilePostgresConfig";

export async function POST(request: Request) {
    let client;
    
    try {
        const { email } = await request.json();
        
        if (!email) {
            return Response.json(
                { error: "Email is required" }, 
                { status: 400 }
            );
        }

        console.log('Attempting to connect to database...');
        client = await pool.connect();
        console.log('Connected to database successfully');

        console.log('Checking user exists:', email);
        const result = await client.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return Response.json(
                { error: "User not found with this email" }, 
                { status: 404 }
            );
        }

        const user = result.rows[0];
        
        return Response.json({ 
            success: true, 
            user: {
                name: user.name,
                email: user.email,
                image: user.image
            },
            message: "User authenticated successfully" 
        });
        
    } catch (error: any) {
        console.error('Database error:', error);
        console.error('Error code:', error.code);
        console.error('Error detail:', error.detail);
        
        if (error.code === 'ECONNREFUSED') {
            return Response.json(
                { error: "Database connection refused" }, 
                { status: 503 }
            );
        }
        
        return Response.json(
            { 
                error: "Failed to authenticate user", 
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