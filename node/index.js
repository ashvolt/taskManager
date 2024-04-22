const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;
const admin = require('./src/config/firebase-config');
app.use(cors());
app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));
const middleware = require('./src/middleware/index');
const { getFirestore, AggregateField } = require('firebase-admin/firestore');
const logsRef = admin.firestore().collection('logs');
//app.use(middleware.decodeToken);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});


const db = getFirestore();
app.post('/insert-log', async (req, res) => {
    console.log(req.body)
    var logEntry = req.body
    logEntry.createdDateTime = new Date().toDateString()

    // Insert log entry into Firebase database
    db.collection('logs').doc(req.body.id).set(logEntry)
        .then(() => {
            res.status(200).json('Log entry inserted successfully!');
        })
        .catch(error => {
            res.status(500).json('Error inserting log entry: ' + error.message);
        });
});
app.get('/logs', async (req, res) => {
    try {
        const statusFilter = req.query.status; // Get the status filter from query parameters
        const sortBy = req.query.sortBy || 'createdAt'; // Default sort field
        const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc'; // Default sort order

        let query = db.collection('logs');
        if (statusFilter) {
            query = query.where('status', '==', statusFilter);
        }
        query = query.orderBy(sortBy, sortOrder);
        //const querySnapshot = (await db.ref('logs').get()).toJSON()
        const querySnapshot = await query.get().catch((error) => {
            console.log(error)
        });

        //   // Map documents to an array of log entries
        //   const logs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(querySnapshot.empty)
        const logs = [];
        querySnapshot.forEach(doc => {
            logs.push({ id: doc.id, ...doc.data() });
        });
        // Send the logs as a JSON response
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/status', async (req, res) => {
    try {
        const coll = db.collection('logs');
        const statuses = ['To Do', 'In Progress', 'Done'];
        let data = []
        for (const status of statuses) {
            const countMediumPSnapshot = await coll.where('status', '==', status).where('priority', '==', 'Medium').count().get();
            const countHighPSnapshot = await coll.where('status', '==', status).where('priority', '==', 'High').count().get();
            const countLowPSnapshot = await coll.where('status', '==', status).where('priority', '==', 'Low').count().get();
            data.push(
                {
                    status: status,
                    count: countMediumPSnapshot.data().count + countHighPSnapshot.data().count + countLowPSnapshot.data().count,
                    low: countLowPSnapshot.data().count,
                    high: countHighPSnapshot.data().count,
                    medium: countMediumPSnapshot.data().count
                }
            )

        }
        res.json({data});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put('/update-log/:id', async (req, res) => {
    const logId = req.params.id;
    const updatedData = req.body;

    try {
        // Update the document with the specified logId
        const logDoc = logsRef.doc(logId);
        await logDoc.update(updatedData);

        res.status(200).json({ message: 'Log updated successfully', id: logId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete('/logs/:id', async (req, res) => {
    try {
        const logId = req.params.id;

        // Delete the document with the specified logId
        await logsRef.doc(logId).delete();

        res.status(200).json({ message: `Task with ID ${logId} deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get('/users', async (req, res) => {
    try {
      const userRecords = await admin.auth().listUsers();
      const users = userRecords.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        // Add other relevant user properties if needed
      }));
      res.status(200).json(users);
    } catch (error) {
      console.error('Error listing users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });