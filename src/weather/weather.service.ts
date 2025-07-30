import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
    constructor(
        private http: HttpService,
        private config: ConfigService
    ) { }

    async getWeather(): Promise<Observable<string>> {
        const city = this.config.get<string>('CITY') || 'Kyiv';
        const apiKey = this.config.get<string>('WEATHER_API_KEY');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ua`;

        return this.http.get(url).pipe(
            map((res) => {
                const data = res.data;
                return `🌤 Weather in ${city}:
                    🌡 Temperature: ${data.main.temp}°C
                    💧 Humidity: ${data.main.humidity}%
                    🌬 Wind: ${data.wind.speed} m/s`;
            }),
            catchError(() => of('Can\'t get the weather'))
        );
    }
}
