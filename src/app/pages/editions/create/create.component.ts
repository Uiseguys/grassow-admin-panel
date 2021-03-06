import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToasterService } from "angular2-toaster";

import { EditionsService } from "../editions.service";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  constructor(
    public router: Router,
    private toasterService: ToasterService,
    private api: EditionsService
  ) {}

  ngOnInit() {}

  handleSubmit = values => {
    if (values.content) {
      values.content = 1;
    } else {
      values.content = 0;
    }
    if (!values.post) {
      values.post = "";
    }
    if (!values.no) {
      values.no = 0;
    }
    const success = () => {
      this.toasterService.popAsync(
        "success",
        "",
        "Publication has been created"
      );
    };

    this.api.createEdition(values).subscribe(
      res => {
        this.toasterService.popAsync("success", "", "Edition has been created");
        this.router.navigate(["/dashboard/editions"]);
      },
      res => {
        const body = JSON.parse(res._body);
        this.toasterService.popAsync(
          "error",
          "",
          (body.error && body.error.message) || "Sorry, something went wrong"
        );
      }
    );
  };
}
