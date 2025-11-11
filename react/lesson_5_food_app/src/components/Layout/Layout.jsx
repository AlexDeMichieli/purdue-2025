import React from 'react';
import Nav from '../Nav/Nav';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">

            <Nav />

         
            <main className="flex-grow flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    );
};

export default Layout;