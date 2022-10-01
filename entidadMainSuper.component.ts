import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConstants } from 'src/app/core/data/core-constants';
import { AuthService } from '../../../auth/services/auth.service';
import { UsuarioService } from '../services/usuarioSuper.service';
import { EntidadService } from '../services/entidadSuper.service';


import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from 'src/app/core/models/usuario.model';
import { SharedConstants } from 'src/app/shared/shared.constants';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgRecaptcha3Service } from 'src/app/shared/services/recaptcha3.service';
import { environment } from 'src/environments/environment';

import {AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';

import {MatTableDataSource} from '@angular/material/table';

declare var $:any;

@Component({
  selector: 'super-main-entidad',
  templateUrl:'./entidadMainSuper.component.html',
  styleUrls: ['./entidadMainSuper.component.css']
  
})


export class EntidadMainSuperComponent implements OnInit {
    

    entidad: any = {id_entidad:"",razon_social:"",sector:""};
    entidadEliminado: any ={id_entidad:""}
    listaEntidades: any=[];
    
    displayedColumns: string[] = ['Nombre','Sector','Acciones'];
    dataSource = new MatTableDataSource(this.listaEntidades);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    
    
    constructor(private formBuilder: FormBuilder,private router: Router,private authService:AuthService,private usuarioService:UsuarioService,private entidadService:EntidadService
      ,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
      $(".breadcrumb-full-width").hide(); 
      this.spinnerService.hide();
      this.cargarEntidades();  
      //this.spinnerService.hide(); 
    }

    

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
    cargarEntidades(){
      //this.entidad = localStorage.getItem("entidad");
      //this.entidad.id_entidad = 91;
      this.spinnerService.show();
      this.entidad.id_entidad = Number(localStorage.getItem("identidad"));
      //console.log(this.entidad);
      
      this.entidadService.getAllEntidades(this.entidad).subscribe(res =>{
          this.listaEntidades= JSON.parse(res.Description); 
          //console.log("INGRESO AL SERVICES ENTIDAD");
          //console.log(this.listaEntidades); 
          this.spinnerService.hide();
          this.dataSource = new MatTableDataSource(this.listaEntidades); 
          this.dataSource.paginator = this.paginator;            
      });
   


    }

    atras(){
        let vista='/super';              
        this.router.navigate([vista]);
    }



    nuevaEntidad(){
        let vista='/super-registrarentidad';              
        this.router.navigate([vista]);
    }

    editarEntidad(idEntidad:any){
      //console.log(idEntidad);
      this.router.navigate(['super-editarentidad',idEntidad]);                  
    }

    eliminarEntidad(idEntidad:any){     
      let respuesta = confirm("Desea eliminar entidad?")
      this.entidadEliminado.id_entidad = idEntidad;
      this.spinnerService.show();
      if(respuesta){       
          this.entidadService.desactivarEntidad(this.entidadEliminado).subscribe(res =>{
              //this.listaUsuarios= JSON.parse(res.Description);
               
              if (res.IsSuccess == true) {
                  let menudefault='/super-entidad';              
                  this.toastr.warning("Entidad Eliminada");              
                  this.router.navigate([menudefault]);
                  this.cargarEntidades();
              }
              
                         
          });
      }
      this.spinnerService.hide();     
     
    }

    

    

    
  
  }
  
