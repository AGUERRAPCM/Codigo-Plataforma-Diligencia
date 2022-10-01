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
  selector: 'admin_selector',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  enti: any = {entidad:""};
  listaEntidades: any=[];
     
    constructor(private formBuilder: FormBuilder,private router: Router,private toastr: ToastrService,private usuarioService:UsuarioService,private spinnerService: NgxSpinnerService,private recaptcha3: NgRecaptcha3Service,) { }
  
    ngOnInit(): void {
      $(".breadcrumb-full-width").hide();
      $("#dropdownUser").show();
      var nombre = localStorage.getItem('Nombre')
      this.obtenerIdEntidad();
    }

    Usuarios(){
      
      //alert("Hictse click")
      let vista = '/usuario';
      this.router.navigate([vista]);
    }

    Entidades(){ 
      var nombre = localStorage.getItem('accessE'); 
      alert("Pronto habra novedades"+nombre) 
    }

    Dependencias(){    
      alert("Pronto habra novedades") 
    }

    Operador(){
        let vista = '/buscardor-inicial';
        this.router.navigate([vista]);
    }


    obtenerIdEntidad(){
      this.enti.entidad = localStorage.getItem('entidad'); 
      console.log(this.enti);    
          this.usuarioService.getIdEntidad(this.enti).subscribe(res=>{
            this.listaEntidades= JSON.parse(res.Description);     
            
            console.log(this.listaEntidades[0]);
            //console.log(this.listaEntidades[0].identidad);
            localStorage.setItem('identidad',this.listaEntidades[0].identidad) 
          });
          //localStorage.setItem('identidad',this.listaEntidades[0].identidad) 
    }


    
    
    
  
  }
  
