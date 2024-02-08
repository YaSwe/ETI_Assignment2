CREATE DATABASE eti_assignment;

CREATE TABLE Accounts (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    Password VARCHAR(20) NOT NULL, 
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UserType enum('user','admin')
);

CREATE TABLE Products (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    ProductTitle VARCHAR(255),
    ProductDesc LONGTEXT,
    ProductImage VARCHAR(255),
    Price DOUBLE NOT NULL,
    Quantity int
);

CREATE TABLE Category (
	CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CatName VARCHAR(255) NOT NULL,
    CatDesc LONGTEXT,
    CatImage VARCHAR(255)
);

CREATE TABLE CatProduct (
    CategoryID int NOT NULL,
    ProductID int NOT NULL,
    PRIMARY KEY (CategoryID, ProductID),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);


CREATE INDEX idx_Accounts_Name ON Accounts(Name);

CREATE TABLE Feedback (
  FeedbackID int PRIMARY KEY AUTO_INCREMENT,
  AccountID int NOT NULL,
  AccountName varchar(50),
  ProductID int,
  Rating int,
  Comment varchar(100),
  FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
  FOREIGN KEY (AccountID) REFERENCES Accounts(ID),
  FOREIGN KEY (AccountName) REFERENCES Accounts(Name)
);

INSERT INTO products (ProductTitle, ProductDesc, ProductImage, Price, Quantity) VALUES
('Stacking Bear Toy Set', 'A set of beautifully crafted stacking bear toys in various shades, perfect for children to develop their motor skills.', 'bears.png', 3.95, 30),
('Animal Sound Boxes', 'Colorful animal sound boxes that stimulate sensory development with each featuring a unique sound.', 'owls.webp', 2.65, 50),
('Plantable Toy Set', 'Adorable plant-themed toy set that encourages eco-awareness from a young age.', 'plants.webp', 2.05, 40),
('Wooden Shopping Trolley', 'A sturdy wooden shopping trolley to help little ones enjoy pretend play while learning about groceries and shopping.', 'wooden-shopping-trolley.webp', 34.95, 20),
('Bamboo Cutlery Set', 'A portable and eco-friendly bamboo cutlery set including a knife, fork, spoon, and straw, complete with a cleaning brush and a carrying case.', 'bamboo-cutleryset.jpg', 12.99, 50),
('Bamboo Toothbrush', 'Sustainable bamboo toothbrush with biodegradable bristles. A perfect eco-friendly alternative to plastic toothbrushes.', 'bamboo-toothbrush.webp', 3.99, 100),
('Herbs Seed Collection Kit', 'Organic seed collection kit with a variety of medicinal herbs. Ideal for starting your own herb garden.', 'herbs-seedkit.jpg', 15.99, 30),
('Organic Cotton Tote Bag', 'Durable, stylish, and eco-friendly tote bag made from organic cotton. Suitable for all your carrying needs.', 'organic-totebag.webp', 9.99, 75),
('Plantable Pencil', 'Eco-friendly pencil that can be planted after use to grow herbs. Comes with a biodegradable plant pot.', 'plantable-pencil.webp', 2.49, 150),
('Organic Navy Blue T-Shirt', 'A comfortable and soft navy blue t-shirt made from 100% organic cotton.', 'organic-blueshirt.webp', 25.00, 100),
('Organic Cotton Khaki Pants', 'Eco-friendly and stylish khaki pants perfect for casual wear, made with organic cotton.', 'organic-brownpants.webp', 35.00, 75),
('Sustainable Cyan T-Shirt with Print', 'Bright cyan t-shirt with an earth-friendly print, crafted with sustainable materials.', 'organic-cyanshirt.webp', 28.00, 50),
('Recycled Denim Jacket', 'Classic denim jacket made from recycled materials, combining style with sustainability.', 'organic-denimajacket.webp', 50.00, 40),
('Eco-Friendly Grey Linen Shirt', 'This grey shirt is made from natural linen, offering a sustainable choice for fashion.', 'organic-greyshirt.webp', 30.00, 60),
('Organic Kids Hoodie', 'A cozy and cute hoodie for kids, made from organic cotton with non-toxic dyes.', 'organic-kidshoodie.webp', 22.00, 80),
('Plant-Based Dye Purple T-Shirt', 'A vibrant purple t-shirt dyed with plant-based colors, soft and eco-conscious.', 'organic-purpleshirt.webp', 25.00, 90),
('Organic White Linen Pants', 'These white linen pants are breathable and made with organic fabric for sustainable luxury.', 'organic-whitepants.webp', 40.00, 70),
('Eco-Friendly Bath Set', 'Complete bath set with a natural brush, loofah, and exfoliating gloves for a sustainable bathing experience.', 'bath-set.webp', 20.00, 50),
('Biodegradable Soap', 'All-natural, biodegradable soap bar that is gentle on the skin and the environment.', 'biodegrable-soap.webp', 5.99, 100),
('Cactus Soap', 'Handmade cactus soap crafted with natural ingredients for a refreshing and hydrating cleanse.', 'cactus-soap.webp', 6.50, 80),
('Eye Contour Gel-Serum', 'Intense hydration eye gel-serum made with organic extracts to rejuvenate the eye area.', 'eye-contour.webp', 45.00, 40),
('Honey Facial Cleanser', 'Natural honey facial cleanser that removes impurities while nourishing the skin.', 'honey-cleanser.webp', 15.00, 60),
('Oatmeal Soap', 'Soothing oatmeal soap bar ideal for sensitive skin, with natural ingredients to protect and care for your skin.', 'oatmeal-soap.webp', 4.50, 70),
('Autumn Berries Shampoo Bar', 'Eco-friendly shampoo bar with a delightful autumn berries scent, perfect for all hair types.', 'shampoo-bar.webp', 8.99, 90);

CREATE TABLE ShopCart (
    ShopCartID INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    ID INT NOT NULL,
    Quantity INT DEFAULT NULL, 
    Total double DEFAULT NULL,
    FOREIGN KEY (ID) REFERENCES accounts(ID)
);

CREATE TABLE ShopCartItem (
    ShopCartID INT NOT NULL,
    ProductID INT NOT NULL,
    Name VARCHAR(255),
    Price double NOT NULL,
    Quantity INT NOT NULL,
    PRIMARY KEY (ShopCartID, ProductID), 
    FOREIGN KEY (ShopCartID) REFERENCES ShopCart(ShopCartID) ,
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

INSERT INTO category(CategoryID, CatName, CatDesc, CatImage) VALUES
(1, "Toys", "Discover our curated collection of Ethical Fashions, where each piece is crafted with care for the environment and respect for the hands that made them. Shop sustainable styles that don't compromise on quality or ethics.", "toy-category.jpg"),
(2, "Ethical Fashion", "Explore a world of imagination with our Children's Toys selection. Find eco-friendly and educational toys designed to inspire creativity and joy in your little ones while being safe for them and the planet.", "fashion-category.avif"),
(3, "Beauty & Wellbeing", "Beautify your living space with our Home & Garden essentials. From comfy, eco-conscious home textiles to garden tools, create a green sanctuary where sustainability meets style.", "beauty-category.avif"),
(4, "Home & Garden", "Pamper yourself with our Beauty & Wellbeing products. Indulge in natural skincare and wellness items that nourish your body, soothe your soul, and are kind to the earth.", "bed-category.jpg");

INSERT INTO catproduct (CategoryID, ProductID) VALUES
(1, 1), 
(1, 2), 
(1, 3),
(1, 4),
(4, 5), 
(4, 6), 
(4, 7), 
(4, 8), 
(4, 9), 
(2, 10), 
(2, 11), 
(2, 12), 
(2, 13), 
(2, 14), 
(2, 15),
(2, 16), 
(2, 17), 
(3, 18), 
(3, 19), 
(3, 20),
(3, 21), 
(3, 22), 
(3, 23), 
(3, 24);
