const {Workbook, Topic, Marker, Zipper} = require('xmind');
const path = require('path');

__author__ = "Malcolm Paltiraja"

function findParent(data, title, parent = null) {
    if (data.title === title) {
        return parent;
    }
    if (data.topics) {
        for (let topic of data.topics) {
            let result = findParent(topic, title, data.title);
            if (result) {
                return result;
            }
        }
    }
    if (data.topic) {
        return findParent(data.topic, title, data.title);
    }
    return null;
}

function main(output, targetLanguage){
    // Create a new Workbook instance
    const filename = `translated_map_${targetLanguage}`;
    const workbook = new Workbook();
    // Create a Topic for the central topic "Indonesia"
    const translated_JSON = require('./translated_data.json');
    const rootTopic = translated_JSON.topic;
    const rootTopicData = new Topic({sheet: workbook.createSheet(translated_JSON.title, rootTopic.title)});
    // const currentDir = path.join(__dirname, 'artifacts');
    const zipper = new Zipper({path: __dirname, workbook, filename: filename});
    
    // Add subtopics recursively
    addSubtopics(rootTopic.topics);
    // Save the mind map
    zipper.save().then(status => {
        if (status) {
            const filePath =filename + '.xmind';
            console.log(`Saved ${filePath}`);
            return filePath;
        } else {
            console.error('Failed to save the mind map.');
        }
    });


    function addSubtopics(topics){
        if (topics.length === 0) return;
        topicNull = []
        topics.forEach(topicData => {
            if (rootTopicData.cid(findParent(translated_JSON, topicData.title)) == null){
                rootTopicData.on(rootTopicData.cid("Central Topic")).add({ title: topicData.title });
              } else {
                rootTopicData.on(rootTopicData.cid(findParent(translated_JSON, topicData.title))).add({ title: topicData.title });
              }
                    
                                        // Recursively add subtopics
                    if (topicData.topics && topicData.topics.length > 0) {
                        addSubtopics(topicData.topics);
                    }
                });
                
    }
    return filename + '.xmind';
}

module.exports = {main};


  






