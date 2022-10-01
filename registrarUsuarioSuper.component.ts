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
  templateUrl: './registrarUsuarioSuper.component.html',
  styleUrls: ['./registrarUsuarioSuper.component.css']
})
export class RegistrarUsuarioSuperComponent implements OnInit {
    loginForm: FormGroup | undefined;
    enti: any = {entidad:""};
    entidadBuscada: any = {entidad:""};

    listaEntidades: any=[];
    identi:any;
    user: any = {numero_documento:"",         };
    usuarioObtenido:any=[];
    //entidadObtenida:any=[];
    existe: any;
    usuario: any = {
      tipo_documento:"",
      numero_documento:"",
      nombres:"",
      paterno:"",
      materno:"",    
      nombre_completo: "",
      password:"",
      tipo_usuario:null,
      estado_usuario:1,
      correo:"",
      descripcion:"",
      id_entidad:"",
      oficina:"",
      cargo:"",     
    };
    
     
    constructor(private formBuilder: FormBuilder,private router: Router,private authService:AuthService,private entidadService:EntidadService,private usuarioService:UsuarioService
      ,private toastr: ToastrService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
        $(".breadcrumb-full-width").hide();
        this.enti.entidad = localStorage.getItem('entidad');     
        this.cargarEntidades();           
    }

    cargarEntidades(){
        this.entidadService.getAllEntidades(this.enti).subscribe(res=>{
          this.listaEntidades= JSON.parse(res.Description); 
          console.log(this.listaEntidades);
          //console.log(this.listaEntidades[0].identidad);
        }); 
    }
    
    registrarUsuario(){
      //this.usuario.nombreCompleto = "Hola";
      console.log("Ingreso REGISTRAR USUARIO SUPER");
      this.usuarioService.registerSuper(this.usuario).subscribe(res =>{
        // this.submitted= false;
        //    this.loading = false;  
        //this.spinnerService.hide();       
        if (res.IsSuccess == true) {
          
        switch (res.Codigo) {
            case CoreConstants.CodigoRespuesta.OperacionExitosa:               
                let menudefault='/super-usuario';              
                this.toastr.info("Usuario Registrado");              
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
       
    

    intentaRegistrarUsuario(){
      console.log("HICISTE CLICK EN INTENTAR GUARDAR");
      console.log(this.usuario);
      // let el =  this.listaEntidades.find((el:any) => el.id_entidad == 5);
      // console.log(el.id_entidad);
      
      if(this.usuario.tipo_documento.trim().length==0){       
          this.toastr.warning("Seleccione su tipo de documento","Complete los campos!!");
        return;
      }
      if(this.usuario.numero_documento.trim().length==0){       
        this.toastr.warning("Ingrese su numero de documento","Complete los campos!!");
        return;
      }
      if(this.usuario.numero_documento.trim().length!=8){       
        this.toastr.warning("Numero DNI invalido","Error!!");
        return;
      }
        
      if(this.usuario.numero_documento.trim().length==8){       
        this.validarNumeroDocumento(this.usuario.numero_documento);     
      } 
      if(this.existe){     
        console.log("VALOR DE EXISTE: ");
        console.log(this.existe);
        this.toastr.warning("El numero de documento ya esta registrado","Error!!");
        return;
      } 
      
        
             
      

      /* VALIDAR SI EXISTE DNI
      if(this.usuario.numero_documento.trim().length==8){    
          this.usuarioService.getUsuarioPorNumDoc(this.user).subscribe(res =>{        
              this.usuarioObtenido= JSON.parse(res.Description);
              if(this.usuarioObtenido.length==1){          
                  this.toastr.warning("El numero de documento ya esta registrado","Error!!");
                  return;   
              }
          });
      }
      */



      /*
      if(this.usuario.tipo_documento=="Carnet de Extranjeria" && this.usuario.numero_documento.trim().length != 8){       
        this.toastr.warning("Numero Carnet invalido","Error!!");
        return;
      }
       */
      if(this.usuario.nombres.trim().length==0){       
        this.toastr.warning("Ingrese su nombre","Complete los campos!!");
        return;
      }
   
      let nombreCompleto = this.usuario.nombres.replace (/\r?\n/g," ");    
      nombreCompleto = nombreCompleto.replace(/[ ]+/g," ");  
      nombreCompleto = nombreCompleto.replace(/^ /,"");
      nombreCompleto = nombreCompleto.replace(/ $/,""); 
      let numeroPalabras = nombreCompleto.split (" ");
           
      console.log(numeroPalabras.length);
      if(numeroPalabras.length < 3){       
        this.toastr.warning("Ingrese su nombre completo","Complete los campos!!");
        return;
      }     
      if(this.usuario.correo.trim().length==0){
        this.toastr.warning("Ingrese su correo","Campo correo es obligatorio!!");
        return;
      }
      
      let expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if ( !expr.test(this.usuario.correo) ){
        this.toastr.warning("Correo Invalido","Error!! ");
        return;
      }
      
      

      if(this.usuario.id_entidad.trim().length==0){       
        this.toastr.warning("Seleccione su entidad","Complete los campos!!");
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


      // validar DNI y estado_usuario y estado_ue no exista
        //this.usuario.nombre_completo = this.usuario.nombres+" "+this.usuario.paterno+" "+this.usuario.materno;
        this.usuario.password = this.generarPassword();
        this.usuario.tipo_usuario = Number(this.usuario.tipo_usuario);
        this.usuario.id_entidad = Number(this.usuario.id_entidad);
        console.log(this.usuario);       
        this.registrarUsuario();
    }

    async validarNumeroDocumento(num:any){      
        //var existe = false;
        this.user.numero_documento = num;
        this.usuarioService.getUsuarioPorNumDoc(this.user).subscribe(res =>{
            //console.log(res);
            this.usuarioObtenido= JSON.parse(res.Description);
            console.log(this.usuarioObtenido.length);     
            if(this.usuarioObtenido.length>0){          
                console.log("SI EXISTE - INGRESO AL IF");    
                this.existe=true;      
            }else{
                console.log("no existe - ingreso al else");    
                this.existe=false;
            }
        }); 
        //return existe; 
      }

      atras(){
        let vista='/super-usuario';              
        this.router.navigate([vista]);
      }

      generarPassword() {
        let result = '';
        const characters = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
      }
     
      
      
      


      
  
  }

  
  
