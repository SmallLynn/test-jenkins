import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'protractor';

export interface Tag {
  name: string;
  code: string;
}

export interface TagDetailConfig {
  columns: TagDetailColumn[];
}

export interface TagDetailColumn {
  name: string;
  label: string;
}

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {
  @Input() data: Tag;
  @Input() configs: TagDetailConfig;
  @Output() closeTag = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  public onCloseTag(e) {
    // this.closeTag.emit(this.tag)
  }

}
