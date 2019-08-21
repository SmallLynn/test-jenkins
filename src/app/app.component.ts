import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Tag } from './tag/tag.component';
import { CateService } from './cate.service';
import { forkJoin } from 'rxjs';
import * as G2 from '@antv/g2';
import * as wordCloudChart from 'word_cloud';

// import * as wordCloudChart from 'word_cloud';
export interface Person {
  id: string;
  level: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('tabs') tabsRef: ElementRef;
  @ViewChild('lopp') loppRef: ElementRef;
  @ViewChild('con') containerRef: ElementRef;
  title = 'test-app';
  activeIndex = null;
  open = false;
  tags = [{
    name: '111',
    code: '111'
  }, {
    name: '222',
    code: '222'
  }];
  tagConfig = {
    columns: [{
      name: 'name',
      label: '名称'
    }, {
      name: 'code',
      label: '代码'
    }]
  };

  public list = [
    'Welcome to Ng Image Slider!',
    'Welcome to Ng Image Slider!',
    'Welcome to Ng Image Slider!',
    'Welcome to Ng Image Slider!'
  ];

  constructor(public cateS: CateService) {

  }

  ngOnInit() {
    // this.tabsRef.nativeElement.scrollLeft = 100;
    this.cateS.getPeople().subscribe(d => {
      const categoryPeople = this.getCategoryOfPeople(d);
      const requests = Object.keys(categoryPeople).map(cate => {
        if (categoryPeople[cate].length > 0) {
          return this.cateS.setPeople({
            id: categoryPeople[cate],
            level: cate
          });
        }
      });
      this.sendRequest(requests);
    });

    // wordCloudChart();
  }

  ngAfterViewInit(): void {
    console.log(this.tabsRef);
    console.log(this.loppRef);
    // this.tabsRef.nativeElement.style.left = 0;
    this.loppRef.nativeElement.style.height = this.loppRef.nativeElement.clientWidth / 1.5 + 'px';
  }

  public getCategoryOfPeople(people: Person[]): { [key: string]: string[] } {
    const categoryOfPeople: { [key: string]: string[] } = {};
    for (const person of people) {
      if (!categoryOfPeople[person.level]) {
        categoryOfPeople[person.level] = [];
      }
      categoryOfPeople[person.level].push(person.id);
    }
    return categoryOfPeople;
  }

  public sendRequest(requests) {
    return forkJoin(requests);
  }

  public popModal(index) {
    this.activeIndex = index;
    this.open = true;
  }

  public closeModal() {
    this.open = false;
    this.activeIndex = null;
  }

  public next() {
    // const bianjie = this.tabsRef.nativeElement.getBoundingClientRect().right; 
    console.log(this.containerRef.nativeElement.getBoundingClientRect());
    console.log(this.tabsRef.nativeElement.getBoundingClientRect());

    const tabClient = this.tabsRef.nativeElement.getBoundingClientRect();
    const conClient = this.containerRef.nativeElement.getBoundingClientRect();
    if (!this.tabsRef.nativeElement.style.left) {
      this.tabsRef.nativeElement.style.left = '0px';
    }
    const left = this.tabsRef.nativeElement.style.left;
    const num = Number(left.split('px')[0]);
    console.log(num);
    if (tabClient.right - 100 <= conClient.right) {
      this.tabsRef.nativeElement.style.left = (num - (tabClient.right - conClient.right)) + 'px';
    } else {
      this.tabsRef.nativeElement.style.left = (num - 100) + 'px';
    }


    // this.tabsRef.nativeElement.style.left = (this.tabsRef.nativeElement.style.left - 10) + 'px';
  }

}
