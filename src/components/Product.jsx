import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc, getDoc, increment, addDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { useAuth } from '../contexts/authContext';
import { IoCubeOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import Loader from './Loader';
function Product() {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [editedProduct, setEditedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('productName'); // Default filter type
    const [loading, setloading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (currentUser) {
                const q = query(collection(firestore, 'products'), where('userUID', '==', currentUser.uid));
                const querySnapshot = await getDocs(q);
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
                setloading(false);
            }
        };
        fetchProducts();
    }, [currentUser]);

    const deleteProduct = async (productId) => {
        try {
            // Fetch the product data before deleting
            const productDocRef = doc(firestore, 'products', productId);
            const productDoc = await getDoc(productDocRef);
            if (!productDoc.exists()) {
                throw new Error('Product not found');
            }
            const productData = productDoc.data();
    
            // Delete the product document from the 'products' collection
            await deleteDoc(productDocRef);
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
    
            // Reference to the stocks collection
            const stockRef = collection(firestore, 'stocks');
            
            // Query to check if a stock document with the same productName exists
            const stockQuery = query(stockRef, where('productName', '==', productData.productName));
            const stockSnapshot = await getDocs(stockQuery);
    
            if (!stockSnapshot.empty) {
                // If the document exists, update the quantity
                stockSnapshot.forEach(async (doc) => {
                    const stockDocRef = doc.ref;
                    const stockData = doc.data();
                    const newQuantity = stockData.quantity - productData.quantityInStock;
    
                    if (newQuantity <= 0) {
                        // If the resulting quantity is zero or less, delete the stock document
                        await deleteDoc(stockDocRef);
                    } else {
                        // Otherwise, update the stock document with the new quantity
                        await updateDoc(stockDocRef, {
                            quantity: newQuantity
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error deleting product: ', error);
        }
    };
    

    const editProduct = (product) => {
        setEditedProduct({ ...product });
    };

    const saveProduct = async () => {
        try {
            // Fetch the old product data before updating
            const oldProductDoc = await getDoc(doc(firestore, 'products', editedProduct.id));
            const oldProductData = oldProductDoc.data();
    
            // Update the product document in the 'products' collection
            await updateDoc(doc(firestore, 'products', editedProduct.id), editedProduct);
            setEditedProduct(null);
    
            // Calculate the quantity difference
            const quantityDifference = editedProduct.quantityInStock - oldProductData.quantityInStock;
    
            // Refetch products after saving changes
            const q = query(collection(firestore, 'products'), where('userUID', '==', currentUser.uid));
            const querySnapshot = await getDocs(q);
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
    
            // Reference to the stocks collection
            const stockRef = collection(firestore, 'stocks');
            
            // Query to check if a stock document with the same productName exists
            const stockQuery = query(stockRef, where('productName', '==', editedProduct.productName));
            const stockSnapshot = await getDocs(stockQuery);
    
            if (!stockSnapshot.empty) {
                // If the document exists, update the quantity
                stockSnapshot.forEach(async (doc) => {
                    const stockDocRef = doc.ref;
                    const stockData = doc.data();
                    const newQuantity = Number(stockData.quantity) + Number(quantityDifference);
    
                    await updateDoc(stockDocRef, {
                        quantity: newQuantity
                    });
                });
            } else {
                // If no such document exists, create a new one (this handles cases where stock might have been deleted)
                await addDoc(stockRef, {
                    productName: editedProduct.productName,
                    quantity: editedProduct.quantityInStock,
                });
            }
        } catch (error) {
            console.error('Error saving product: ', error);
        }
    };
    
    
    
    
    

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setEditedProduct(prevProduct => ({
            ...prevProduct,
            [id]: value
        }));
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const filteredProducts = products.filter(product => {
        const valueToFilter = product[filterType];
        return valueToFilter && typeof valueToFilter === 'string' && valueToFilter.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className='Product'>
            {loading && <Loader />}
            <span className='shades' id='shade1'></span>

            <div className='ProductHeader'>
                <div>
                    <IoCubeOutline />Product
                </div>
                <Link to="/dashboard/add-to-product"><IoIosAddCircleOutline />Product</Link>
            </div>

            <div className='ProductHolder'>
                <div className="filterOptions">
                    <label>
                        <input
                            type="radio"
                            value="productName"
                            checked={filterType === 'productName'}
                            onChange={handleFilterChange}
                        />
                        productName
                    </label>
                    {/* Add more radio buttons for other filter options */}
                </div>
                <div className='searchBarHolderInProduct'>
                    <input
                        placeholder={`Search by ${filterType}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <label><FaSearch /></label>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>productName</th>
                            <th>quantityInStock</th>
                            
                            
                            <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>{editedProduct && editedProduct.id === product.id ? <input type="text" id="productName" value={editedProduct.productName} onChange={handleInputChange} /> : product.productName}</td>
                                <td>{editedProduct && editedProduct.id === product.id ? <input type="number" id="quantityInStock" value={editedProduct.quantityInStock} onChange={handleInputChange} /> : product.quantityInStock}</td>
                                
                                
                                
                                <td style={{ display: "flex", justifyContent: 'center' }}>
                                    {editedProduct && editedProduct.id === product.id ? (
                                        <button onClick={saveProduct}>Save</button>
                                    ) : (
                                        <>
                                            <button onClick={() => deleteProduct(product.id)} style={{ backgroundColor: '#DC3545', color: "white" }}>Delete</button>
                                            <button onClick={() => editProduct(product)}>Update</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Product;