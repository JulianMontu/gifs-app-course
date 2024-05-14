import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';



@Injectable({providedIn: 'root'})
export class GifsService {

    public gifList: Gif[] = [];

    private _tagsHistory: string[] = [];
    private apiKey: string = "bvgaotDFj2mKBKUvAZxkKll9KA4CHBk2"
    private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

    constructor( private hhtp: HttpClient) {
        this.loadStorage();
     }
    
    get GettagsHistory(){
        return [...this._tagsHistory];
    }

    private organizeHistory(tag: string){
        tag = tag.toLocaleLowerCase();

        if(this._tagsHistory.includes(tag)){
            this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);

        }

        this._tagsHistory.unshift(tag);
        this._tagsHistory = this._tagsHistory.splice(0,10);
        this.saveLocalStorage();
    }

    private saveLocalStorage():void{
        localStorage.setItem('history', JSON.stringify(this._tagsHistory))
    }

    private loadStorage():void{
        if(!localStorage.getItem('history')) return;

        this._tagsHistory = JSON.parse(localStorage.getItem('history')!)
        
        if(this._tagsHistory.length === 0) return;

        this.searchTag(this._tagsHistory[0])
    }


    searchTag( tag: string ):void{
        if(tag.length === 0) return;

        this.organizeHistory(tag);

        const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit', '10')
        .set('q', tag)
        
        this.hhtp.get<SearchResponse>(
            `${this.serviceUrl}/search`,{ params: params }
        ).subscribe( 
            resp => {
                this.gifList = resp.data;
            }
        )
    }
}