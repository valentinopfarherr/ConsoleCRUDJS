const fs = require('fs');
const readline = require('readline');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  readProducts() {
    try {
      const data = fs.readFileSync(this.path);
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts(products) {
    fs.writeFileSync(this.path, JSON.stringify(products));
  }

  generateId() {
    const products = this.readProducts();
    const lastProduct = products[products.length - 1];
    return lastProduct ? lastProduct.id + 1 : 1;
  }

  addProduct() {
    rl.question('\nEnter the product title: ', (title) => {
      rl.question('Enter the product description: ', (description) => {
        rl.question('Enter the product price: ', (price) => {
          rl.question('Enter the product thumbnail: ', (thumbnail) => {
            rl.question('Enter the product code: ', (code) => {
              rl.question('Enter the product stock: ', (stock) => {
                const products = this.readProducts();
                const newProduct = {
                  id: this.generateId(),
                  title: title,
                  description: description,
                  price: parseFloat(price),
                  thumbnail: thumbnail,
                  code: code,
                  stock: parseInt(stock)
                };
                products.push(newProduct);
                this.saveProducts(products);
                console.log(`\nProduct with id ${newProduct.id} has been added`);
                mainMenu();
              });
            });
          });
        });
      });
    });
  }


  deleteProduct() {
    rl.question('\nEnter the id of the product to delete: ', (id) => {
      let products = this.readProducts();
      products = products.filter((product) => product.id !== parseInt(id));
      this.saveProducts(products);
      console.log(`\nProduct with id ${id} deleted`);
      mainMenu();
    });
  }

  modifyProduct() {
    rl.question('\nEnter the id of the product to modify: ', (id) => {
      rl.question('Enter the new price of the product: ', (price) => {
        let products = this.readProducts();
        const index = products.findIndex((product) => product.id === parseInt(id));
        if (index === -1) {
          console.log(`\nProduct with id ${id} not found`);
        } else {
          products[index].price = parseFloat(price);
          this.saveProducts(products);
          console.log(`\nProduct with id ${id} modified`);
        }
        mainMenu();
      });
    });
  }

  updateProduct() {
    rl.question('\nEnter the id of the product to update: ', (id) => {
      let products = this.readProducts();
      const index = products.findIndex((product) => product.id === parseInt(id));
      if (index === -1) {
        console.log(`\nProduct with id ${id} not found`);
        mainMenu();
      } else {
        rl.question('Enter the new title of the product: ', (title) => {
          rl.question('Enter the new description of the product: ', (description) => {
            rl.question('Enter the new price of the product: ', (price) => {
              rl.question('Enter the new thumbnail of the product: ', (thumbnail) => {
                rl.question('Enter the new code of the product: ', (code) => {
                  rl.question('Enter the new stock of the product: ', (stock) => {
                    products[index].title = title;
                    products[index].description = description;
                    products[index].price = parseFloat(price);
                    products[index].thumbnail = thumbnail;
                    products[index].code = code;
                    products[index].stock = parseInt(stock);
                    this.saveProducts(products);
                    console.log(`\nProduct with id ${id} has been updated`);
                    mainMenu();
                  });
                });
              });
            });
          });
        });
      }
    });
  }

  getProducts() {
    const products = this.readProducts();
    if (products.length === 0) {
      console.log('\nNo products to show');
    } else {
      console.log('\nList of products:\n');
      products.forEach((product) => {
        console.log(`Id: ${product.id}, Title: ${product.title}, Description: ${product.description}, Price: $${product.price}, Thumbnail: ${product.thumbnail}, Code: ${product.code}, Stock: ${product.stock}`);
      });
    }
    rl.question('\nPress enter to back to main menu\n', () => {
      mainMenu();
    });
  }

  getProductById() {
    rl.question('\nEnter the id of the product: ', (id) => {
      const products = this.readProducts();
      const product = products.find((product) => product.id === parseInt(id));
      if (product) {
        console.log(`\nId: ${product.id}`);
        console.log(`Title: ${product.title}`);
        console.log(`Description: ${product.description}`);
        console.log(`Price: $${product.price}`);
        console.log(`Thumbnail: ${product.thumbnail}`);
        console.log(`Code: ${product.code}`);
        console.log(`Stock: ${product.stock}`);
      } else {
        console.log(`\nProduct with id ${id} not found`);
      }
      mainMenu();
    });
  }
}

console.log('\nWelcome to the product management system');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const manager = new ProductManager('products.json');
let exit = false;

function mainMenu() {
  rl.question('\nWhat action do you want to perform? (add, delete, modify, update, get, list, exit): ', (action) => {
    switch (action) {
      case 'add':
        manager.addProduct();
        break;
      case 'delete':
        manager.deleteProduct();
        break;
      case 'modify':
        manager.modifyProduct();
        break;
      case 'update':
        manager.updateProduct();
        break;
      case 'get':
        manager.getProductById();
        break;
      case 'list':
        manager.getProducts();
        break;
      case 'exit':
        console.log('Goodbye!');
        rl.close();
        break;
      default:
        console.log('Invalid action');
        mainMenu();
        break;
    }
  });
}

mainMenu();

