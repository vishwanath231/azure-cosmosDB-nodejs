import express from 'express';
import { CosmosClient } from '@azure/cosmos';

const app = express();
app.use(express.json());

const endpoint = 'https://learningcosmosdbdemo.documents.azure.com:443/';
const key = 'sPoL7KTdExAgkvoWGY2oTUnCWvOAROiFDeGDEyNTXmKcCpT0zR8by0nFR5dZdUu6ZeMm8zlLinWJACDbtqOMJw=='
const databaseId = 'learningcosmoscontainer';
const containerId = 'users';

const client = new CosmosClient({ endpoint, key });

app.post('/cosmos', async (req, res) => {

    try {
        const { id, name, sex, company, location } = req.body;

        if (!id || !name || !sex || !company || !location) {
            res.status(404).json({ error: 'All fields are required' });
        }

        const database = client.database(databaseId);
        const container = database.container(containerId);

        // Test insertion
        const { resource: item } = await container.items.create({
            id: id,
            name: name,
            sex: sex,
            company: company,
            location: location
        });

        res.status(201).json({ message:'Item created successfully' ,...item});

    } catch (error) {
        console.error('Error:', error);
    }
})


app.get('/cosmos', async (req, res)  => {
    try {
        const database = client.database(databaseId);
        const container = database.container(containerId);

        // Query all items in the container
        const { resources: items } = await container.items.query('SELECT * FROM c').fetchAll();

        res.status(200).json(items);
        
    } catch (error) {
        console.error('Error:', error);
    }
})



const port = 5001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
