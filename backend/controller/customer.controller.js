import CustomerModel from "../model/customer.js";



const getAllCustomers = async (req, res) => {
    try {
        const customers = await CustomerModel.find();
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving customers' });
    }
};


const createCustomer = async (req, res) => {
    const { name, email, phone, username, password, role } = req.body;

    try {
        const assignedRole = (email === "admin@example.com") ? 'admin' : 'customer';
        const newCustomer = new CustomerModel({ name, email, phone, username, password, role: role || assignedRole });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'มีชื่อผู้ใช้นี้แล้ว' });
        }
        res.status(500).json({ message: 'Error creating customer' });
    }
};



export {
    getAllCustomers,
    createCustomer
}