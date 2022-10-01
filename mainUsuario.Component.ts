import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConstants } from 'src/app/core/data/core-constants';
import { AuthService } from '../../../auth/services/auth.service';
import { UsuarioService } from '../services/usuario.service';
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
  selector: 'main-user',
  templateUrl: './mainUsuario.component.html',
  styleUrls: ['./mainUsuario.component.css']
})
export class MainUsuarioComponent implements OnInit {
    

    entidad: any = {id_entidad:"",razon_social:"",sector:""};
    usuarioEliminado: any ={id_usuario:""}
    listaUsuarios: any=[];
    
    displayedColumns: string[] = ['Oficina', 'Cargo', 'NumeroDocumento', 'Nombres','Acciones'];
    dataSource = new MatTableDataSource(this.listaUsuarios);
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    
    
    constructor(private formBuilder: FormBuilder,private router: Router,private authService:AuthService,private usuarioService:UsuarioService
      ,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
      $(".breadcrumb-full-width").hide(); 
      this.cargarUsuarios();  
      this.spinnerService.hide();
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
      
      this.usuarioService.getAllUsuarios(this.entidad).subscribe(res =>{
          this.listaUsuarios= JSON.parse(res.Description); 
          //console.log(this.listaUsuarios); 
          this.dataSource = new MatTableDataSource(this.listaUsuarios); 
          this.dataSource.paginator = this.paginator; 
          this.spinnerService.hide();           
      });
   


    }

    atras(){
        let vista='/admin';              
        this.router.navigate([vista]);
    }

    nuevoUsuario(){
        let vista='/registrarusuario';              
        this.router.navigate([vista]);
    }

    editarUsuario(idUsuario:any){
      this.router.navigate(['editarusuario',idUsuario]);                  
    }

    eliminarUsuario(idUsuario:any){     
      let respuesta = confirm("Desea eliminar usuario?")
      this.usuarioEliminado.id_usuario = idUsuario;
      if(respuesta){       
          this.usuarioService.deleteUser(this.usuarioEliminado).subscribe(res =>{
              //this.listaUsuarios= JSON.parse(res.Description); 
              if (res.IsSuccess == true) {
                  let menudefault='/usuario';              
                  this.toastr.warning("Usuario Eliminado");              
                  this.router.navigate([menudefault]);
                  this.cargarUsuarios();
              }
                         
          });
      }
      


     
    }

    

    

    
  
  }
  
