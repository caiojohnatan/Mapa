import { Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage {
  map!: L.Map;
  searchInput: string = ''; // Variável para armazenar o valor inserido no campo de pesquisa

  constructor() {}

  ngOnInit() {
    this.map = L.map('map', {
      center: [0, 0],
      zoom: 15,
      renderer: L.canvas(),
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

    this.setupGeolocation();
  }

  setupGeolocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (pos) => this.success(pos),
        (err) => this.error(err),
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    } else {
      console.log('Geolocation is not available in this browser.');
    }
  }

  success(pos: GeolocationPosition) {
    console.log(pos.coords.latitude, pos.coords.longitude);

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map', {
      center: [pos.coords.latitude, pos.coords.longitude],
      zoom: 13,
      renderer: L.canvas(),
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    L.marker([pos.coords.latitude, pos.coords.longitude])
      .addTo(this.map)
      .bindPopup('Eu estou aqui!')
      .openPopup();
  }

  error(err: GeolocationPositionError) {
    console.log(err.message);
  }

  searchLocation() {
    // Use um serviço de geocodificação para obter as coordenadas do local inserido
    // Aqui, você pode usar o serviço Nominatim da OpenStreetMap como exemplo
    const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${this.searchInput}`;

    fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const result = data[0];
          const latitude = parseFloat(result.lat);
          const longitude = parseFloat(result.lon);
          this.updateMapLocation(latitude, longitude);
        } else {
          console.log('Local não encontrado');
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar local:', error);
      });
  }

  updateMapLocation(latitude: number, longitude: number) {
    this.map.setView([latitude, longitude], 13);
    L.marker([latitude, longitude])
      .addTo(this.map)
      .bindPopup('Local Pesquisado')
      .openPopup();
  }
}