import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgRecaptcha3Service } from 'src/app/shared/services/recaptcha3.service';
import { environment } from 'src/environments/environment';
import { UsuarioService } from '../admin/services/usuario.service';

declare var $:any;
@Component({
  selector: 'super-admin',
  templateUrl: './adminSuper.component.html',
  styleUrls: ['./adminSuper.component.css']
})
export class AdminSuperComponent implements OnInit {
  enti: any = {entidad:""};
  listaEntidades: any=[];
     
    constructor(private formBuilder: FormBuilder,private router: Router,private toastr: ToastrService,private usuarioService:UsuarioService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
      $(".breadcrumb-full-width").hide();
      $("#dropdownUser").show();
      var nombre = localStorage.getItem('Nombre')
      //this.obtenerIdEntidad();
    }

    Usuarios(){
      
      
      let vista = '/super-usuario';
      this.router.navigate([vista]);
    }

    Entidades(){ 
      let vista = '/super-entidad';
      this.router.navigate([vista]);
    } 

    Operador(){
        let vista = '/buscardor-inicial';
        this.router.navigate([vista]);
    }


    obtenerIdEntidad(){
        this.enti.entidad = localStorage.getItem('entidad'); 
        //console.log(this.enti);    
          this.usuarioService.getIdEntidad(this.enti).subscribe(res=>{
            this.listaEntidades= JSON.parse(res.Description);     
            
            //console.log(this.listaEntidades[0]);
            //console.log(this.listaEntidades[0].identidad);
            localStorage.setItem('identidad',this.listaEntidades[0].identidad) 
          });
          //localStorage.setItem('identidad',this.listaEntidades[0].identidad) 
    }


    
    
    
  
  }
  
