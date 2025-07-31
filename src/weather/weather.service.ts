import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class WeatherService {
    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService
    ) { }

    async getWeather(): Promise<string> {
        const city = this.config.get<string>('CITY') || 'Kyiv';
        const apiKey = this.config.get<string>('WEATHER_API_KEY');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ua`;

        return await firstValueFrom(
            this.http.get(url).pipe(
                map((res) => {
                    const data = res.data;
                    return `🌤 Weather in ${city}:
🌡 Temperature: ${data.main.temp}°C
💧 Humidity: ${data.main.humidity}%
🌬 Wind: ${data.wind.speed} m/s`;
                }),
                catchError(() => {
                    return of('Can\'t get the weather');
                })
            )
        );
    }

}
