const { run } = require("./runner");
const prompt = require("prompt-sync")({
	sigint: true, // Allow Ctrl+C to exit
	history: require("prompt-sync-history")(), // Allow up/down arrow keys to navigate history
});
const fs = require("fs");

let argv = process.argv;

if (argv.length == 2) {
	console.log("Running in interactive mode\n");
	while (true) {
		const data = prompt("fluent > ");
		if (data.trim() == "") continue;
		prompt.history.save();
		let { result, error } = run("<stdin>", data);

		if (error) console.log(error.asError());
		else if (result) console.log(result.toString());
	}
} else {
	let filename = argv[2];
	let filecontent = fs.readFileSync(filename, { encoding: "utf-8" });
	let { result, error } = run(filename, filecontent);
	if (error) console.log(error.asError());
	// else if (result) console.log(result.toString());
}
