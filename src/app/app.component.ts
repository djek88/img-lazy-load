import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Image {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

const IMAGE_URL = 'https://jsonplaceholder.typicode.com/albums/1/photos?_limit=10';
const COLUMN_NUMBER = 3;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  arraysOfImages: Observable<Image[][]> = this.httpClient.get<Image[]>(IMAGE_URL)
    .pipe(
      map((images) => this.chunkArray(images, COLUMN_NUMBER)),
    );

  constructor(
    private httpClient: HttpClient
  ) { }

  private chunkArray(arr: any[], chunksNumber: number) {
    const results = [];

    for (let i = 0; i < chunksNumber; i++) {
      let chunkSize = arr.length / (chunksNumber - i);
      chunkSize = +chunkSize.toFixed(0);

      results.push(arr.splice(0, chunkSize));
    }

    return results;
  }
}
