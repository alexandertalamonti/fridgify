# Fridgify

The fridge is in need of disruption. I often find myself buying the same groceries multiple times because I forget that I already have them in my fridge. Additionally, I sometimes will forget to buy an ingredient, because I think I have it only to realize that it has expired...

Enter Fridgify! Fridgify is a Next.js application that allows you to maintain a virtual inventory of your fridge. With Fridgify, you can:

- Add and remove items from your fridge inventory
- Categorize items for better organization
- Set expiration dates for each item
- Get visual alerts when items are expired
- Fetch images for your items using the Pixabay API
- Export and import your inventory data as JSON files

Fridgify helps you keep track of what's in your fridge, reducing food waste and saving you money by preventing duplicate purchases.

## Setup and Running the Project

1. Clone the repository:
```
git clone https://github.com/alexandertalamonti/fridgify
```
2. Navigate to the project directory:
```
cd fridgify
```
3. Install the dependencies:
```
npm install
```

4. Set up your Pixabay API key:
- Create a `.env.local` file in the root of your project.
- Add the following line to the `.env.local` file, replacing `your_pixabay_api_key` with your actual API key:
  ```
  NEXT_PUBLIC_PIXABAY_API_KEY=your_pixabay_api_key
  ```

5. Run the app:
```
npm start
```
Please note that this should work as I combined the build and start commands into one. However if it does not work, please run
```
npm build && npm start
```


6. Open your browser and navigate to `http://localhost:3000` to see the application running.

## API Integration

Fridgify integrates with the Pixabay API to fetch images for your fridge items. When you add a new item, Fridgify sends a request to the Pixabay API with the item name as a search query. If the API returns any results, the first image URL is stored with the item and displayed in the application.

The Pixabay API integration is handled in the `src/lib/pixabay.js` file. The `getImageForFood` function sends a request to the Pixabay API with your API key and the item name, and returns the URL of the first image result (if any).

To use the Pixabay API, you need to sign up for a free account and obtain an API key. The API key is stored in the `.env.local` file and accessed via the `process.env.NEXT_PUBLIC_PIXABAY_API_KEY` environment variable.

## AI-Generated Code

Portions of the Fridgify codebase were generated with the assistance of an AI language model. The AI was used to:

- Provide guidance on structuring the Next.js application
- Assist with integrating the Pixabay API
- Generate code snippets for specific features, such as adding and removing items, categorizing items, and handling data export/import
- Make style changes to improve the look and feel of the application

## Credits

Fridgify was developed by Alexander Talamonti with the assistance of an AI language model provided by Anthropic's Claude (Claude 3 Opus). The application uses the Pixabay API for fetching item images.
