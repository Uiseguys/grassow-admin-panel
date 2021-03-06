import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";

import { SettingsService } from "../../../services/settings/settings.service";
import { NewsService } from "../../../pages/news/news.service";
import * as bigInt from "big-integer";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {
  news: any;
  error = "";
  validUrl = true;

  // Takes Milliseconds and quantifies the amount of time
  timeDiff = (ms): string => {
    if (bigInt(ms).geq(31536000000)) {
      // Check years
      ms = bigInt(ms).divide(31536000000);
      return `${ms} ${ms < 2 ? "yr" : "yrs"}`;
    } else if (bigInt(ms).geq(18144000000)) {
      // Check months
      ms = bigInt(ms).divide(18144000000);
      ms = Math.round(ms);
      return `${ms} ${ms < 2 ? "month" : "months"}`;
    } else if (bigInt(ms).geq(604800000)) {
      // Check weeks
      ms = bigInt(ms).divide(604800000);
      ms = Math.round(ms);
      return `${ms} ${ms < 2 ? "wk" : "wks"}`;
    } else if (bigInt(ms).geq(86400000)) {
      // Check days
      ms = bigInt(ms).divide(86400000);
      ms = Math.round(ms);
      return `${ms} ${ms < 2 ? "day" : "days"}`;
    } else if (bigInt(ms).geq(3600000)) {
      // Check hours
      ms = bigInt(ms).divide(3600000);
      ms = Math.round(ms);
      return `${ms} ${ms < 2 ? "hr" : "hrs"}`;
    } else if (bigInt(ms).geq(60000)) {
      // Check minutes
      ms = bigInt(ms).divide(60000);
      ms = Math.round(ms);
      return `${ms} ${ms < 2 ? "min" : "mins"}`;
    } else if (bigInt(ms).geq(1000)) {
      // Check seconds
      return Math.round(ms / 1000) + "s";
    }
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private api: NewsService,
    private settings: SettingsService
  ) {}

  ngOnInit() {
    this.api.getAll().subscribe(res => {
      const date = new Date().getTime();
      let tmp;
      this.news = res.map((item, index) => {
        tmp = date - Date.parse(res[index].create_time);
        item.create_time = this.timeDiff(tmp);
        item["image"] = item["image"] ? JSON.parse(item.image) : [];
        return item;
      });
    });
  }

  deleteNews(id) {
    if (!confirm("Are you sure to delete")) {
      return;
    }

    this.api.deleteNews(id).subscribe(
      res => {
        this.news = this.news.filter(item => item.id != id);
      },
      res => {
        const error = JSON.parse(res._body);
        this.error =
          (error.error && error.error.message) || "Sorry, something is wrong";
      }
    );
  }

  getImageUrl(url) {
    if (url) {
      return `${this.settings.API_URL}${url}`;
    }
    return "-";
  }

  getRoleName(role) {
    return role.map(item => item.name).join(",");
  }
}
