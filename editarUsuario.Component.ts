import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { CoreConstants } from 'src/app/core/data/core-constants';
import { AuthService } from '../../../../auth/services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from 'src/app/core/models/usuario.model';
import { SharedConstants } from 'src/app/shared/shared.constants';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgRecaptcha3Service } from 'src/app/shared/services/recaptcha3.service';
import { environment } from 'src/environments/environment';


declare var $:any;
@Component({
  selector: 'edit-user',
  templateUrl: './editarUsuario.component.html',
  styleUrls: ['./editarUsuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
    loginForm: FormGroup | undefined;
    user: any = {id_user:""};
    loading: boolean = false;
    error: string = "";
    warning: string = "";
    submitted = false;
    siteKey: string = environment.recaptcha3Key; 
    listaUsuarios: any=[];
    usuario: any = {
      id_usuario:"",
      tipo_documento:"",
      numero_documento:"",
      nombres:"",
      //paterno:"",
      //materno:"",    
      //nombre_completo: "",
      //password:"",
      //tipo_usuario:0,
      //estado_usuario:1,
      correo:"",
      //descripcion:"",
      //id_entidad:"",
      oficina:"",
      cargo:"",     
    };
    usuarioEditado:any = {id_usuario:""}
    constructor(private formBuilder: FormBuilder,private router: Router,private activerouter:ActivatedRoute,private authService:AuthService,private usuarioService:UsuarioService
      ,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
        $(".breadcrumb-full-width").hide();
        const idUsuarioEditado = this.activerouter.snapshot.paramMap.get('id');     
        this.cargarUsuario(idUsuarioEditado);
        
     
    }
    
    actualizarUsuario(){
      console.log("EMPEZO A ACTUALIZAR");
      console.log(this.usuario);
      this.usuarioService.update(this.usuario).subscribe(res =>{
        // this.submitted= false;
        //    this.loading = false;  
        // this.spinnerService.hide();       
        if (res.IsSuccess == true) {
          
        switch (res.Codigo) {
            case CoreConstants.CodigoRespuesta.OperacionExitosa:               
                let menudefault='/usuario';              
                this.toastr.info("Usuario Actualizado");              
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

    intentaActualizarUsuario(){
      console.log("HICISTE CLICK EN ACTUALIZAR");
      if(this.usuario.tipo_documento.trim().length==0){       
        this.toastr.warning("Seleccione su tipo de documento","Complete los campos!!");
        return;
      }
      if(this.usuario.numero_documento.trim().length==0){       
        this.toastr.warning("Ingrese su numero de documento","Complete los campos!!");
        return;
      }
      
      if(this.usuario.nombres.trim().length==0){       
        this.toastr.warning("Ingrese su nombre","Complete los campos!!");
        return;
      }
      /*
      if(this.usuario.paterno.trim().length==0){
        this.toastr.warning("Ingrese su apellido paterno","Campo usuario es obligatorio!!");
        return;
      }
      if(this.usuario.materno.trim().length==0){
        this.toastr.warning("Ingrese su apellido materno","Campo usuario es obligatorio!!");
        return;
      }
      */
      if(this.usuario.correo.trim().length==0){
        this.toastr.warning("Ingrese su correo","Campo correo es obligatorio!!");
        return;
      }
      if(this.usuario.oficina.trim().length==0){       
        this.toastr.warning("Seleccione su oficina","Complete los campos!!");
        return;
      }
      if(this.usuario.cargo.trim().length==0){       
        this.toastr.warning("Ingrese su cargo","Faltan datos");
        return;
      }
      //this.usuario.id_usuario = idUsuarioEditado;

      // validar DNI y estado_usuario y estado_ue no exista
        //this.usuario.nombre_completo = this.usuario.nombres+" "+this.usuario.paterno+" "+this.usuario.materno;
        //this.usuario.password = this.generarPassword();
        //this.usuario.id_entidad = this.listaEntidades[0].identidad;
        console.log(this.usuario);       
        this.actualizarUsuario();
    }

    cargarUsuario(id:any){
      console.log("INGRESO AL EDITAR COMPONENT");
      console.log(id);
      this.usuarioEditado.id_usuario = Number(id);
      console.log(this.usuarioEditado);
      this.spinnerService.show();
      this.usuarioService.getUsuarioPorId(this.usuarioEditado).subscribe(res =>{
        if(res.IsSuccess = true){
            console.log("inreso al SUCDCES TRUE");
            this.listaUsuarios= JSON.parse(res.Description);
            console.log(this.listaUsuarios);
            // tipo_documento:"",
            // numero_documento:"",
            // nombres:"",
            // paterno:"",
            // materno:"",    
            // nombre_completo: "",
            // password:"",
            // tipo_usuario:0,
            // estado_usuario:1,
            // correo:"",
            // descripcion:"",
            // id_entidad:"",
            // oficina:"",
            // cargo:"",  

            for( let usuarioObtenido of this.listaUsuarios){
              this.usuario.id_usuario = usuarioObtenido.idUsuario;
              this.usuario.tipo_documento=  usuarioObtenido.tipoDocumento;
              this.usuario.numero_documento=  usuarioObtenido.nrodocumento;
              this.usuario.nombres=  usuarioObtenido.paterno;
              //this.usuario.paterno=  user.paterno;
              
              //this.obtenerPaterno(this.usuario.paterno);
              this.usuario.materno=  usuarioObtenido.materno;
              this.usuario.correo=  usuarioObtenido.correo;
              this.usuario.oficina=  usuarioObtenido.oficina;
              this.usuario.cargo=  usuarioObtenido.cargo;
                
            }
           
           

            //console.log(this.listaUsuarios[0]);
            //this.usuario.numero_documento = this.listaUsuarios[0].numero_documento;
        }else{
          console.log("NO INGRESO al SUCDCES TRUE");
        }
        this.spinnerService.hide();
        // this.listaUsuarios= JSON.parse(res.Description);
        // //console.log(this.listaUsuarios[0]);
        // this.usuario.numero_documento = this.listaUsuarios[0].numero_documento;
                    
      });
    }

    

    atras(){
        let vista='/usuario';              
        this.router.navigate([vista]);
    }
  
  }
  
