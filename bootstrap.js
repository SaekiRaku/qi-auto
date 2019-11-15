import constructor from "./constructor";

const cmd = process.argv[2];
const args = process.argv.slice(3);

// process.on('unhandledRejection', (reason, p) => {
//     console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
// });

switch (cmd) {
    case "develop":
        constructor.develop();
        break;
    case "build":
        constructor.build();
        break;
}