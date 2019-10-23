import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/dashboardService';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // private toastr: ToastrService
  constructor(private formBuilder: FormBuilder, private dashboardService: UserService,
  ) { }
  public leftMenu: any;
  public navData: any;

  public emptyMessage: Boolean = true;
  public SystemConfiguration: Boolean = false;
  public BlackList: Boolean = false;
  public WhiteList: Boolean = false;
  public SpecialNumber: Boolean = false;
  public clickedIndex: number;
  public listScreen: Boolean = false;
  SystemConfigurationForm: FormGroup;
  submittedSystemConfigurationForm = false;
  systemConfigFetchData: any;
  blacklistFetchData: any;
  whiteListFetchData: any;
  BlackListForm: FormGroup;
  submittedBlackListForm = false;

  WhiteListForm: FormGroup;
  submittedWhiteListForm = false;

  ngOnInit() {
    this.leftMenu =
      [
        {
          'sno': 1,
          'name': 'System Configuration'
        },
        {
          'sno': 2,
          'name': 'Black List'
        },
        {
          'sno': 3,
          'name': 'White List'
        },
        {
          'sno': 4,
          'name': 'Special Number'
        },
        {
          'sno': 5,
          'name': 'Fetch Data'
        }
      ];
    this.navData = [];

    this.SystemConfigurationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      configName: ['', Validators.required],
      comments: ['']
    });

    this.BlackListForm = this.formBuilder.group({
      configName: ['', Validators.required],
      config_id: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // number:['',[Validators.required, Validators.pattern('[7-9]\\d{9}')]],
      block_list_reason: ['', Validators.required]
    });

    this.WhiteListForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      // number:['',[Validators.required, Validators.pattern('[7-9]\\d{9}')]],
      white_list_reason: ['', Validators.required]
    });
  }

  selectedData = (data: string) => {
    console.log("data selected!!!", data);
    console.log("length::::", this.navData);
    if (this.navData.length >= 2) {
      alert('Cannot Select More than Two Configuration');
    } else {
      var idx = this.navData.indexOf(data);
      if (idx > -1) {
        alert('Cannot Select Same Configuration');
      }
      else {
        this.navData.push(data);
      }
    }
    console.log("pushed!! data:::", this.navData);
    if (this.navData.length == 0) {
      this.emptyMessage = true;
    } else {
      this.emptyMessage = false;
    }
  }
  removeSelected = (data: string) => {
    var idx = this.navData.indexOf(data);
    if (idx > -1) {
      console.log("Already Data is available!!!");
      this.navData.splice(idx, 1);
    }
  }

  renderForm = (data: string, index: number) => {
    console.log("clicked!!!!", index);
    this.clickedIndex = index;
    if (data == 'System Configuration') {
      this.SystemConfiguration = true;
      this.BlackList = false;
      this.WhiteList = false;
      this.SpecialNumber = false;
      this.emptyMessage = false;
      this.listScreen = false;
    } else if (data == 'Black List') {
      this.SystemConfiguration = false;
      this.BlackList = true;
      this.WhiteList = false;
      this.SpecialNumber = false;
      this.emptyMessage = false;
      this.listScreen = false;
    } else if (data == 'White List') {
      this.SystemConfiguration = false;
      this.BlackList = false;
      this.WhiteList = true;
      this.SpecialNumber = false;
      this.emptyMessage = false;
      this.listScreen = false;
    } else if (data == 'Special Number') {
      this.SystemConfiguration = false;
      this.BlackList = false;
      this.WhiteList = false;
      this.SpecialNumber = true;
      this.emptyMessage = false;
      this.listScreen = false;
    } else {
      this.dashboardService.fetchSystemConfig()
        .subscribe(data => {
          if (data) {
            this.systemConfigFetchData = data;
            console.log("system config:::",this.systemConfigFetchData);
            this.dashboardService.fetchBlackList()
              .subscribe(data => {
                if (data) {
                  this.blacklistFetchData = data;
                  console.log("Black List Data:::",this.blacklistFetchData);
                  this.dashboardService.fetchWhiteList()
                    .subscribe(data => {
                      if (data) {
                        this.whiteListFetchData = data;
                        console.log("Whiet List :::",this.whiteListFetchData);
                        console.log("data for feching::::", data);
                        this.SystemConfiguration = false;
                        this.BlackList = false;
                        this.WhiteList = false;
                        this.SpecialNumber = false;
                        this.emptyMessage = false;
                        this.listScreen = true;
                      } else {
                        alert("Error while White List data");
                      }
                    });
                } else {
                  alert("Error while BlacList data");
                }
              });
          } else {
            alert("Error while Fetching System Configuration");
          }
        });
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.SystemConfigurationForm.controls; }
  onSubmitSystemConfig() {
    this.submittedSystemConfigurationForm = true;
    // stop here if form is invalid
    if (this.SystemConfigurationForm.invalid) {
      return;
    }
    else {
      console.log("this.SystemConfigurationForm.value", this.SystemConfigurationForm.value)
      this.dashboardService.saveSystemConfig(this.SystemConfigurationForm.value)
        .subscribe(data => {
          if (data) {
            alert("Config Saved Sucessfully");

            this.submittedSystemConfigurationForm = false;
            this.SystemConfigurationForm.reset();
          } else {
            alert("Error while saving config");

          }
        });

    }
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.SystemConfigurationForm.value))
  }

  get b() { return this.BlackListForm.controls; }
  BlackListFormSubmit() {
    this.submittedBlackListForm = true;
    // stop here if form is invalid
    if (this.BlackListForm.invalid) {
      return;
    } else {
      this.dashboardService.saveBlackList(this.BlackListForm.value)
        .subscribe(data => {
          if (data) {
            alert("Black List Saved Sucessfully");

            this.submittedBlackListForm = false;
            this.BlackListForm.reset();
          } else {
            alert("Unable to save black list.Please try again");

          }
        });
    }

  }

  get w() { return this.WhiteListForm.controls; }
  WhiteListFormSubmit() {
    this.submittedWhiteListForm = true;
    // stop here if form is invalid
    if (this.WhiteListForm.invalid) {
      return;
    } else {
      this.dashboardService.saveWhiteList(this.WhiteListForm.value)
        .subscribe(data => {
          if (data) {
            alert("White List Saved Sucessfully");
            this.submittedWhiteListForm = false;
            this.WhiteListForm.reset();
          } else {
            alert("Unable to save White list.Please try again");
          }
        });
    }

  }

}
