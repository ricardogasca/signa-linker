
import React from 'react';
import { Signature } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-auto border-t border-border">
      <div className="max-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-primary mb-4">
              <Signature className="h-6 w-6" />
              <span className="font-medium text-lg tracking-tight">StrategySign</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Secure document signing platform designed with simplicity and security in mind.
              Upload, send, and manage documents with digital signatures.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-sm mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-all-smooth">Features</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-all-smooth">Security</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-all-smooth">Pricing</a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-sm mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-all-smooth">Privacy</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-all-smooth">Terms</a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-all-smooth">Security</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} StrategySign. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-all-smooth">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-all-smooth">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
