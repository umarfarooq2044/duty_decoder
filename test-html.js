const http = require('http');

http.get('http://localhost:3000/calculate/', (res) => {
    let data = '';

    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        const headStart = data.indexOf('<head>');
        const headEnd = data.indexOf('</head>');
        const titleLoc = data.indexOf('<title>');
        const titleEnd = data.indexOf('</title>');
        const bodyStart = data.indexOf('<body');

        console.log("Stats layout from raw string matching:");
        console.log("<head> starts at", headStart);
        console.log("<head> ends at", headEnd);
        console.log("<title> starts at", titleLoc);
        console.log("<title> content: ", data.substring(titleLoc, titleEnd + 8));
        console.log("<body> starts at", bodyStart);

        if (titleLoc > headEnd) {
            console.log("ERROR: <title> is found after </head> !!!");
        } else {
            console.log("OK: <title> is before </head>");
        }

        // Write the data to a local file for deeper inspection if needed
        require('fs').writeFileSync('debug_html.txt', data);
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
