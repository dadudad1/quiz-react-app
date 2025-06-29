#!/usr/bin/env node

const fs = require('fs');

function fixJsonSyntax(jsonText) {
    // Fix common JSON syntax issues
    let fixed = jsonText;
    
    // Fix missing quotes around object keys
    fixed = fixed.replace(/(\s+)([A-Z]\.)(\s+)/g, '$1"$2"$3');
    
    // Fix missing closing quotes
    fixed = fixed.replace(/("B":\s*"[^"]*)\n\s*([A-Z]\.)/g, '$1",$\n      "$2');
    
    // Fix missing quotes around option C when formatted as "C."
    fixed = fixed.replace(/\n\s*C\.\s*/g, '\n      "C": ');
    
    // Fix missing commas before option letters
    fixed = fixed.replace(/"\n\s*([A-E]):/g, '",\n      "$1":');
    
    return fixed;
}

function parseAnswers(answersText) {
    const answers = {};
    const entries = answersText.split(/[;\n]/).filter(entry => entry.trim());
    
    entries.forEach(entry => {
        const match = entry.trim().match(/^(\d+)\.([A-E]+)$/);
        if (match) {
            answers[parseInt(match[1])] = match[2];
        }
    });
    
    return answers;
}

function addAnswersToQuestions(questionsData, answers) {
    let addedCount = 0;
    
    questionsData.forEach(question => {
        if (question.numar && answers[question.numar]) {
            question.raspuns = answers[question.numar];
            addedCount++;
        }
    });
    
    return addedCount;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length !== 2) {
        console.log('Usage: node fix-and-add-answers.js <questions.json> <answers.txt>');
        console.log('');
        console.log('Example:');
        console.log('  node fix-and-add-answers.js cap1.json cap1_raspunsuri');
        process.exit(1);
    }
    
    const [jsonFile, answersFile] = args;
    
    try {
        // Check if files exist
        if (!fs.existsSync(jsonFile)) {
            throw new Error(`JSON file not found: ${jsonFile}`);
        }
        if (!fs.existsSync(answersFile)) {
            throw new Error(`Answers file not found: ${answersFile}`);
        }
        
        // Read and fix JSON file
        console.log(`📄 Reading and fixing JSON from: ${jsonFile}`);
        let jsonText = fs.readFileSync(jsonFile, 'utf8');
        
        // Try to parse as-is first
        let questionsData;
        try {
            questionsData = JSON.parse(jsonText);
            console.log('✅ JSON is already valid');
        } catch (e) {
            console.log('🔧 Attempting to fix JSON syntax...');
            const fixedJson = fixJsonSyntax(jsonText);
            
            try {
                questionsData = JSON.parse(fixedJson);
                console.log('✅ JSON syntax fixed successfully');
                
                // Save the fixed JSON
                const fixedFile = jsonFile.replace('.json', '_fixed.json');
                fs.writeFileSync(fixedFile, JSON.stringify(questionsData, null, 2));
                console.log(`💾 Fixed JSON saved as: ${fixedFile}`);
            } catch (e2) {
                throw new Error(`Could not fix JSON syntax: ${e2.message}`);
            }
        }
        
        // Read answers file
        console.log(`📝 Reading answers from: ${answersFile}`);
        const answersText = fs.readFileSync(answersFile, 'utf8');
        const answers = parseAnswers(answersText);
        
        console.log(`🔍 Found ${Object.keys(answers).length} answers`);
        console.log(`📊 Processing ${questionsData.length} questions...`);
        
        // Add answers to questions
        const addedCount = addAnswersToQuestions(questionsData, answers);
        
        // Generate output filename
        const outputFile = jsonFile.replace('.json', '_with_answers.json');
        
        // Write updated JSON
        fs.writeFileSync(outputFile, JSON.stringify(questionsData, null, 2));
        
        console.log(`✅ Successfully processed ${addedCount} questions with answers!`);
        console.log(`💾 Updated file saved as: ${outputFile}`);
        
        // Show some statistics
        const questionsWithAnswers = questionsData.filter(q => q.raspuns).length;
        const questionsWithoutAnswers = questionsData.length - questionsWithAnswers;
        
        console.log('');
        console.log('📈 Statistics:');
        console.log(`  Total questions: ${questionsData.length}`);
        console.log(`  Questions with answers: ${questionsWithAnswers}`);
        console.log(`  Questions without answers: ${questionsWithoutAnswers}`);
        
        if (questionsWithoutAnswers > 0 && questionsWithoutAnswers < 10) {
            console.log('');
            console.log('⚠️  Questions without answers:');
            questionsData.forEach(q => {
                if (!q.raspuns) {
                    console.log(`  Question ${q.numar}: ${q.intrebare?.substring(0, 50)}...`);
                }
            });
        }
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { fixJsonSyntax, parseAnswers, addAnswersToQuestions }; 