import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  officeGroups = ['A', 'B', 'C', 'D'];
  deskNumbers = [1, 2, 3, 4];

  deskStatusMap: { [key: string]: string } = {
    A3: 'booked',
    B1: 'booked',
    B2: 'booked',
  };

  getStatus(groupId: string, deskNum: number): string {
    const id = groupId + deskNum;
    return this.deskStatusMap[id] || 'available';
  }

  toggleDesk(groupId: string, deskNum: number) {
    const id = groupId + deskNum;
    const currentStatus = this.getStatus(groupId, deskNum);

    if (currentStatus === 'available') {
      this.resetSelections();
      this.deskStatusMap[id] = 'selected';
    } else if (currentStatus === 'selected') {
      this.deskStatusMap[id] = 'available';
    }
  }

  resetSelections() {
    for (const deskId in this.deskStatusMap) {
      if (this.deskStatusMap[deskId] === 'selected') {
        this.deskStatusMap[deskId] = 'available';
      }
    }
  }
}
