import jwt from 'jsonwebtoken';
import CustomerModel from '../model/customer.js';



const login = async (req, res) => {
    const { username, password } = req.body;

    try {

        const user = await CustomerModel.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });


        if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });


        const token = jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10h' });

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { login };