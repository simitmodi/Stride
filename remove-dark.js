const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (file.match(/\.(tsx|ts|jsx|js|css)$/)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Match 'dark:' followed by any characters that are valid in Tailwind classes (including arbitrary values like dark:bg-[#000] and modifiers like dark:hover:text-white)
            const regex = /\bdark:[a-zA-Z0-9_\-/[\]:]+\b/g;
            const newContent = content.replace(regex, '');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

const targets = [
    path.join(__dirname, 'src/app/dashboard'),
    path.join(__dirname, 'src/components/appointment-card.tsx'),
    path.join(__dirname, 'src/components/appointment-details-modal.tsx'),
    path.join(__dirname, 'src/components/customer-appointment-details-modal.tsx'),
    path.join(__dirname, 'src/components/past-appointments.tsx'),
    path.join(__dirname, 'src/components/upcoming-appointments.tsx'),
    path.join(__dirname, 'src/components/greeting.tsx'),
    path.join(__dirname, 'src/components/header.tsx'),
    path.join(__dirname, 'src/components/editable-field.tsx')
];

for (const target of targets) {
    if (fs.existsSync(target)) {
        if (fs.statSync(target).isDirectory()) {
            processDir(target);
        } else {
            let content = fs.readFileSync(target, 'utf8');
            const regex = /\bdark:[a-zA-Z0-9_\-/[\]:]+\b/g;
            const newContent = content.replace(regex, '');
            if (content !== newContent) {
                fs.writeFileSync(target, newContent, 'utf8');
                console.log(`Updated ${target}`);
            }
        }
    }
}
console.log('Done');
