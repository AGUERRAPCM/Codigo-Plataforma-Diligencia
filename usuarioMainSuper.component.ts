import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConstants } from 'src/app/core/data/core-constants';
import { AuthService } from '../../../auth/services/auth.service';
import { UsuarioService } from '../services/usuarioSuper.service';
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
  selector: 'super-main-user',
  templateUrl:'./usuarioMainSuper.component.html',
  styleUrls: ['./usuarioMainSuper.component.css']
  
})


export class UsuarioMainSuperComponent implements OnInit {
    

    entidad: any = {id_entidad:"",razon_social:"",sector:""};
    usuarioEliminado: any ={id_usuario:""}
    listaUsuarios: any=[];
    
    displayedColumns: string[] = ['Entidad','Oficina', 'NumeroDocumento', 'Nombres','Acciones'];
    dataSource = new MatTableDataSource(this.listaUsuarios);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    
    
    constructor(private formBuilder: FormBuilder,private router: Router,private authService:AuthService,private usuarioService:UsuarioService
      ,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
      $(".breadcrumb-full-width").hide(); 
      this.spinnerService.hide();
      this.cargarUsuarios();  
      
    }

    

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    
    cargarUsuarios(){
      //this.entidad = localStorage.getItem("entidad");
      //this.entidad.id_entidad = 91;
      this.spinnerService.show();
      this.entidad.id_entidad = Number(localStorage.getItem("identidad"));
      //console.log(this.entidad);
      
      this.usuarioService.getAllUsuariosSuper(this.entidad).subscribe(res =>{
          this.listaUsuarios= JSON.parse(res.Description); 
          // console.log("INGRESO AL SERVICES");
          // console.log(this.listaUsuarios); 
          this.spinnerService.hide();
          this.dataSource = new MatTableDataSource(this.listaUsuarios); 
          this.dataSource.paginator = this.paginator;            
      });
   


    }

    atras(){
        let vista='/super';              
        this.router.navigate([vista]);
    }



    nuevoUsuario(){
        let vista='/super-registrarusuario';              
        this.router.navigate([vista]);
    }

    editarUsuario(idUsuario:any){
      this.router.navigate(['super-editarusuario',idUsuario]);                  
    }

    eliminarUsuario(idUsuario:any){     
      let respuesta = confirm("Desea eliminar usuario?")
      this.usuarioEliminado.id_usuario = idUsuario;
      if(respuesta){       
          this.usuarioService.desactivarUser(this.usuarioEliminado).subscribe(res =>{
              //this.listaUsuarios= JSON.parse(res.Description); 
              if (res.IsSuccess == true) {
                  let menudefault='/super-usuario';              
                  this.toastr.warning("Usuario Eliminado");              
                  this.router.navigate([menudefault]);
                  this.cargarUsuarios();
              }
                         
          });
      }     
     
    }

    

    

    
  
  }
  
