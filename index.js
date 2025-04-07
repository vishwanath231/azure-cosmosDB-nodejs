import express from 'express';
import { CosmosClient } from '@azure/cosmos';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;
const databaseId = process.env.DATABASE_ID;
const containerId = process.env.CONTAINER_ID;

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
