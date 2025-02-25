# 👟 Shoes Store Web Application

A modern e-commerce web application for selling shoes, built with React and powered by JSON Server for the backend.

## 🎯 Project Overview

This application provides a seamless shopping experience for customers looking to purchase shoes online. It features product browsing, shopping cart functionality, and user management.

## 🛠️ Available Scripts

In the project directory, you can run:

### 🚀 `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### 🧪 `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### 📦 `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### 💾 Database Services

#### 📊 `json-server --watch %USERPROFILE%\src\data\db.json --port 5000`

Runs the product database server on port 5000.\
This database contains product information including shoes inventory, prices, categories, and product details.\
The database file should be located at `C:\Users\<your_username>\db.json`\
Open [http://localhost:5000](http://localhost:5000) to view the database.

#### 👥 `json-server --watch %USERPROFILE%\src\data\user.json --port 5001`

Runs the user management database server on port 5001.\
This database contains user profiles, authentication data, and shopping cart information.\
The database file should be located at `C:\Users\<your_username>\user.json`\
Open [http://localhost:5001](http://localhost:5001) to view the database.

**Note:** Replace `%USERPROFILE%` with `C:\Users\<your_username>` or use the environment variable as is.

### ⚙️ `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## 📚 Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
