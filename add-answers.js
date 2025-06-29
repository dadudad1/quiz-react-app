#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseAnswers(answersText) {
    const answers = {};
    // Handle both semicolon and newline separators
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
        console.log('Usage: node add-answers.js <questions.json> <answers.txt>');
        console.log('');
        console.log('Example:');
        console.log('  node add-answers.js cap1.json cap1_raspunsuri');
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
        
        // Read JSON file
        console.log(`📄 Reading questions from: ${jsonFile}`);
        const jsonText = fs.readFileSync(jsonFile, 'utf8');
        let questionsData;
        
        try {
            questionsData = JSON.parse(jsonText);
        } catch (e) {
            throw new Error(`Invalid JSON format in ${jsonFile}: ${e.message}`);
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
        
        if (questionsWithoutAnswers > 0) {
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

module.exports = { parseAnswers, addAnswersToQuestions }; 