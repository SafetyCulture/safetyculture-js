var context = require.context('./test/unit', true, /\.js$/);
context.keys().forEach(context);
