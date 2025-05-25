const readline = require("readline");
const { execSync } = require("child_process");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("📝 Комментарий к коммиту: ", (message) => {
    rl.close();

    try {
        console.log("\n📦 git status:");
        const status = execSync("git status", { encoding: "utf8" });
        console.log(status);

        console.log("➕ Добавляем изменения...");
        execSync("git add -A", { stdio: "inherit" });

        console.log("✅ Коммитим...");
        execSync(`git commit -m "${message}"`, { stdio: "inherit" });

        console.log("☁️ Пушим в репу...");
        execSync("git push", { stdio: "inherit" });

        console.log("🎉 Всё пушнулось, брат!");
    } catch (err) {
        console.error("❌ Ошибка:\n", err.message);
    }
});