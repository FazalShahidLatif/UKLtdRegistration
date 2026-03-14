<?php
/**
 * UK LTD Registration - Status Page
 * This page is shown if the Node.js application is starting or temporarily unavailable.
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UK LTD Registration | Under Maintenance</title>
    <style>
        :root {
            --primary: #764ba2;
            --secondary: #667eea;
            --text: #ffffff;
        }
        body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
            color: var(--text);
            overflow: hidden;
        }
        .container {
            text-align: center;
            padding: 3rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.2);
            max-width: 500px;
            width: 90%;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 { 
            font-size: 2.2rem; 
            margin-bottom: 0.5rem;
            letter-spacing: -0.5px;
        }
        p { 
            font-size: 1.1rem; 
            opacity: 0.9; 
            line-height: 1.6;
        }
        .loader {
            width: 60px;
            height: 60px;
            border: 5px solid rgba(255,255,255,0.1);
            border-top-color: #fff;
            border-radius: 50%;
            margin: 2rem auto;
            animation: spin 1s linear infinite;
        }
        .status-badge {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-top: 1.5rem;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
            h1 { font-size: 1.8rem; }
            .container { padding: 2rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>UK LTD Registration</h1>
        <div class="loader"></div>
        <p>Our systems are initializing.</p>
        <p style="font-size:0.9rem;">We are performing a scheduled update to bring you a better experience. We'll be back online in just a moment.</p>
        
        <div class="status-badge">System Restart in Progress</div>
        
        <p style="font-size:0.75rem; margin-top:3rem; opacity: 0.6;">
            &copy; <?php echo date('Y'); ?> UK LTD Registration. All rights reserved.
        </p>
    </div>
    <script>
        // Check if the application is back online every 30 seconds
        setInterval(() => {
            fetch('/')
                .then(response => {
                    if (response.status === 200) {
                        window.location.reload();
                    }
                })
                .catch(() => { /* Still down */ });
        }, 30000);
    </script>
</body>
</html>
