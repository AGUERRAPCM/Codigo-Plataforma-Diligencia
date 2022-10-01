import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConstants } from 'src/app/core/data/core-constants';
import { AuthService } from '../../../../auth/services/auth.service';
import { UsuarioService } from '../../services/usuarioSuper.service';
import { EntidadService } from '../../services/entidadSuper.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from 'src/app/core/models/usuario.model';
import { SharedConstants } from 'src/app/shared/shared.constants';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgRecaptcha3Service } from 'src/app/shared/services/recaptcha3.service';
import { environment } from 'src/environments/environment';


declare var $:any;
@Component({
  selector: 'new-user-super',
  templateUrl: './registrarEntidadSuper.component.html',
  styleUrls: ['./registrarEntidadSuper.component.css']
})
export class RegistrarEntidadSuperComponent implements OnInit {
    loginForm: FormGroup | undefined;
    enti: any = {entidad:""};
    entidadBuscada: any = {entidad:""};

    listaEntidades: any=[];
    identi:any;
    user: any = {numero_documento:"",         };
    usuarioObtenido:any=[];
    //entidadObtenida:any=[];
    existe: any;
    entidad: any = {
      ruc_entidad:" ",
      razon_social:" ",
      gobierno:" ",
      sector:" ",
      pliego:" ",    
      ejecutora: " ",
         
    };
    
     
    constructor(private formBuilder: FormBuilder,private router: Router,private authService:AuthService,private entidadService:EntidadService,private usuarioService:UsuarioService
      ,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
        $(".breadcrumb-full-width").hide();
        this.enti.entidad = localStorage.getItem('entidad');     
        //this.cargarEntidades();
        this.spinnerService.hide();            
    }
/*
    cargarEntidades(){
        this.spinnerService.show(); 
        this.entidadService.getAllEntidades(this.enti).subscribe(res=>{
          this.listaEntidades= JSON.parse(res.Description); 
          console.log(this.listaEntidades);
          this.spinnerService.hide(); 
          //console.log(this.listaEntidades[0].identidad);
        }); 
    }
    */
    registrarEntidad(){
      //this.usuario.nombreCompleto = "Hola";
      console.log("Ingreso REGISTRAR USUARIO SUPER");
      this.entidadService.registerEntidad(this.entidad).subscribe(res =>{
        // this.submitted= false;
        //    this.loading = false;  
        this.spinnerService.show();       
        if (res.IsSuccess == true) {
          
        switch (res.Codigo) {
            case CoreConstants.CodigoRespuesta.OperacionExitosa:               
                let menudefault='/super-entidad';              
                this.toastr.info("Entidad Registrada");              
                this.router.navigate([menudefault]);
                return; 
            case CoreConstants.CodigoRespuesta.OperacionNoEjecutada: 
                this.toastr.warning(SharedConstants.mensajesValidacionServicio.msgOperacionNoEjecutada,CoreConstants.TitulosToastr.Warning);
                return; 
            case CoreConstants.CodigoRespuesta.ErrorNoControlado: 
                this.toastr.error(SharedConstants.mensajesValidacionServicio.msgErrorServidor,CoreConstants.TitulosToastr.Error);
                return; 
            case CoreConstants.CodigoRespuesta.OperacionValidacionDatos: 
                this.toastr.warning(res.Message,CoreConstants.TitulosToastr.Warning);
                return; 
          }
        }else{
            this.toastr.error(res.Message);
        }
        this.spinnerService.hide(); 
    });
   
    }
       
    

    intentaRegistrarEntidad(){
        console.log("HICISTE CLICK EN INTENTAR GUARDAR");
        //console.log(this.entidad);   
        /*
        if(this.entidad.ruc_entidad.trim().length==0){       
            this.toastr.warning("Seleccione su tipo de documento","Complete los campos!!");
            return;
        }
        */
        if(this.entidad.razon_social.trim().length==0){       
            this.toastr.warning("Ingrese nombre de la Entidad","Complete los campos!!");
            return;
        }
        if(this.entidad.sector.trim().length==0){       
            this.toastr.warning("Ingrese el sector de la Entidad","Complete los campos!!");
            return;
        }
            
        console.log(this.entidad);       
        this.registrarEntidad();
    }

    

      atras(){
        let vista='/super-entidad';              
        this.router.navigate([vista]);
      }

      
     
      
      
      


      
  
  }

  
  
