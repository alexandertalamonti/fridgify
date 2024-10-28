'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getImageForFood } from '@/lib/pixabay';

// background colors for categories that we will iterate thru
const categoryColors = [
    'bg-blue-100',
    'bg-gray-100',
];

// custom component that is the meat of our app
export default function InventoryManager() {
  // set up state
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState({});
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState({ category: '', name: '', quantity: 1, expirationDate: '' });

  // load data from localStorage when component mounts
  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    const savedItems = localStorage.getItem('items');
    if (savedCategories) setCategories(JSON.parse(savedCategories));
    if (savedItems) setItems(JSON.parse(savedItems));
  }, []);

  // save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
    localStorage.setItem('items', JSON.stringify(items));
  }, [categories, items]);

  // add a new category to state
  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setItems({ ...items, [newCategory]: [] });
      setNewCategory('');
    }
  };

  // remove a category from state
  const removeCategory = (category) => {
    const updatedCategories = categories.filter(cat => cat !== category);
    const updatedItems = { ...items };
    delete updatedItems[category];
    setCategories(updatedCategories);
    setItems(updatedItems);
  };

  // add item to state - must be async because the api calls in here
  const addItem = async () => {
    if (newItem.category && newItem.name && newItem.expirationDate) {
      const imageUrl = await getImageForFood(newItem.name);
      const updatedItems = { ...items };
      updatedItems[newItem.category] = [
        ...updatedItems[newItem.category],
        { ...newItem, id: Date.now().toString(), imageUrl }
      ];
      setItems(updatedItems);
      setNewItem({ category: '', name: '', quantity: 1, expirationDate: '' });
    }
  };

  // remove item from state
  const removeItem = (category, id) => {
    const updatedItems = { ...items };
    updatedItems[category] = updatedItems[category].filter(item => item.id !== id);
    setItems(updatedItems);
  };

  // check if expiration date is before today
  const isExpired = (date) => new Date(date) < new Date();

  // export data to JSON so we can load it in later
  const exportData = () => {
    const data = {
      categories: categories,
      items: items
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'fridge_inventory.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // import data from json so we can move data from different 
  // virtual locatoins if needed
  const importData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // update state from json
        const data = JSON.parse(e.target.result);
        setCategories(data.categories);
        setItems(data.items);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Error importing data. Please make sure the file is valid JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-4">
        <div className="mb-4 flex space-x-2">
        <Button onClick={exportData}>Export Data</Button>
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded">
            Import Data
            <input
            type="file"
            accept=".json"
            className="hidden"
            onChange={importData}
            />
        </label>
        </div>
    
        <div className="mb-6">
        <Label htmlFor="newCategory" className="block mb-2">New Category</Label>
        <div className="flex gap-2">
            <Input
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
            className="flex-grow"
            />
            <Button onClick={addCategory}>Add Category</Button>
        </div>
        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
            <Label htmlFor="category" className="block mb-2">Category</Label>
            <Select
            value={newItem.category}
            onValueChange={(value) => setNewItem({ ...newItem, category: value })}
            >
            <SelectTrigger>
                <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="name" className="block mb-2">Name</Label>
            <Input
            id="name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Item name"
            />
        </div>
        <div>
            <Label htmlFor="quantity" className="block mb-2">Quantity</Label>
            <Input
            id="quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
            min="1"
            />
        </div>
        <div>
            <Label htmlFor="expiration" className="block mb-2">Expiration Date</Label>
            <Input
            id="expiration"
            type="date"
            value={newItem.expirationDate}
            onChange={(e) => setNewItem({ ...newItem, expirationDate: e.target.value })}
            />
        </div>
        <div className="flex items-end">
            <Button onClick={addItem} className="w-full">Add Item</Button>
        </div>
        </div>
        {categories.map((category, index) => ( // map over categories and display each item in fridge
            <div key={category} className={`mb-6 p-4 rounded ${categoryColors[index % categoryColors.length]}`}>
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{category}</h2>
                <Button variant="destructive" onClick={() => removeCategory(category)}>Delete Category</Button>
                </div>
                {items[category] && items[category].length > 0 ? (
                <ul className="space-y-2">
                    {items[category].map((item) => (
                    <li 
                        key={item.id} 
                        className={`flex justify-between items-center p-2 border rounded ${
                        isExpired(item.expirationDate) ? 'bg-red-200' : 'bg-white'
                        }`}
                    >
                        <div className="flex items-center space-x-4">
                        {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        )}
                        <span className={isExpired(item.expirationDate) ? 'line-through' : ''}>
                            <strong>
                                {item.name}
                            </strong> 
                            - Qty: {item.quantity} - Expires: {item.expirationDate}
                        </span>
                        </div>
                        <Button variant="destructive" onClick={() => removeItem(category, item.id)}>Remove</Button>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-gray-500 italic">No items in this category</p>
                )}
            </div>
        ))}
    </div>
    );    
}