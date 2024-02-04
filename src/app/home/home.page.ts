import { Component } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  items: any[] = [];
  newItem: any;

  constructor(private databaseService: DatabaseService, private alertController: AlertController) { }

  ngOnInit() {
    this.databaseService.createDatabase().then(() => {
      this.loadItems();
    });
  }

  loadItems() {
    this.databaseService.getItems().then((items) => {
      this.items = items;
    });
  }

  addItem() {
    if (this.newItem) {
      this.databaseService.addItem(this.newItem).then(() => {
        this.newItem = '';
        this.loadItems();
      });
    }
  }

  async editItem(itemId: number) {
    const item = this.items.find((item) => item.id === itemId);
    if (!item) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Edit Item',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: item.name,
          placeholder: 'Enter a new name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async (data) => {
            const name = data.name.trim();
            if (name !== '') {
              await this.databaseService.updateItem(item.id, name);
              this.loadItems();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteItem(itemId: number) {
    this.databaseService.deleteItem(itemId).then(() => {
      this.loadItems();
    });
  }

}
