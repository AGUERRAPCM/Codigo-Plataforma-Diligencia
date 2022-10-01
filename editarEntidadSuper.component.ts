import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

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
  selector: 'edit-entidad',
  templateUrl: './editarEntidadSuper.component.html',
  styleUrls: ['./editarEntidadSuper.component.css']
})
export class EditarEntidadSuperComponent implements OnInit {
    loginForm: FormGroup | undefined;
    user: any = {id_user:""};
    loading: boolean = false;
    error: string = "";
    warning: string = "";
    submitted = false;
    siteKey: string = environment.recaptcha3Key; 
    listaEntidades: any=[];
    entidad: any = {
      ruc_entidad:" ",
      razon_social:" ",
      gobierno:" ",
      sector:" ",
      pliego:" ",    
      ejecutora: " ",
         
    };
    entidadEditado:any = {id_entidad:""}
    constructor(private formBuilder: FormBuilder,private router: Router,private activerouter:ActivatedRoute,private authService:AuthService,private usuarioService:UsuarioService
      ,private entidadService: EntidadService,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
        $(".breadcrumb-full-width").hide();
        const idEntidadEditada = this.activerouter.snapshot.paramMap.get('id');     
        this.cargarEntidad(idEntidadEditada);
        
     
    }
    
    actualizarEntidad(){
      console.log("EMPEZO A ACTUALIZAR");
      console.log(this.entidad);
      this.entidadService.updateEntidad(this.entidad).subscribe(res =>{
        // this.submitted= false;
        //    this.loading = false;  
        // this.spinnerService.hide();       
        if (res.IsSuccess == true) {
          
        switch (res.Codigo) {
            case CoreConstants.CodigoRespuesta.OperacionExitosa:               
                let menudefault='/super-entidad';              
                this.toastr.info("Entidad Actualizada");              
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
    });
   
    }

    intentaActualizarEntidad(){
      console.log("HICISTE CLICK EN INTENTAR ACTUALIZAR");
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
      this.actualizarEntidad();
  }

    cargarEntidad(id:any){
      console.log("INGRESO AL EDITAR COMPONENT");
      console.log(id);
      this.entidadEditado.id_entidad = Number(id);
      console.log(this.entidadEditado);
      this.spinnerService.show();
      this.entidadService.getEntidadPorId(this.entidadEditado).subscribe(res =>{
        if(res.IsSuccess = true){
            //console.log("inreso al SUCDCES TRUE");
            this.listaEntidades= JSON.parse(res.Description);
            console.log(this.listaEntidades);
            
           

            for( let entidadObtenido of this.listaEntidades){
              this.entidad.id_entidad = entidadObtenido.idEntidad;
              this.entidad.ruc_entidad=  entidadObtenido.ruc;
              this.entidad.razon_social=  entidadObtenido.nombre;
              this.entidad.gobierno=  entidadObtenido.gobierno;
              this.entidad.sector=  entidadObtenido.sector;
              this.entidad.pliego=  entidadObtenido.pliego;
              this.entidad.ejecutora=  entidadObtenido.ejecutora;
              
                
            }
            this.spinnerService.hide();
           

            //console.log(this.listaUsuarios[0]);
            //this.usuario.numero_documento = this.listaUsuarios[0].numero_documento;
        }else{
          console.log("NO INGRESO al SUCDCES TRUE");
        }
        // this.listaUsuarios= JSON.parse(res.Description);
        // //console.log(this.listaUsuarios[0]);
        // this.usuario.numero_documento = this.listaUsuarios[0].numero_documento;
                    
      });
    }

    

    atras(){
        let vista='/super-entidad';              
        this.router.navigate([vista]);
    }
  
  }
  
