<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

set_time_limit(0);
class Facturacion extends CI_Controller {
	private $obj;
	private $obj2;
	private $caja = 0;
	private $fact = 0;
	private $fecha;
	
	public function __construct()
	{
		parent::__construct();
		set_headers();
		$res=valid_token();	
		$this->load->model('model_facturacion','model');
		$this->load->library('table');
		$tmpl = array (
			'table_open'          => '<table border="1" class="table">',
			'heading_row_start'   => '<tr">',
			'heading_row_end'     => '</tr>',
			'heading_cell_start'  => '<th>',
			'heading_cell_end'    => '</th>',
			'row_start'           => '<tr>',
			'row_end'             => '</tr>',
			'cell_start'          => '<td>',
			'cell_end'            => '</td>',	
			'row_alt_start'       => '<tr>',
			'row_alt_end'         => '</tr>',
			'cell_alt_start'      => '<td>',
			'cell_alt_end'        => '</td>',
			'table_close'         => '</table>'
		);
		$this->table->set_template($tmpl);
	}
	public function index(){
		if($this->input->get('u')=='karen' and $this->input->get('p')=='Toxica01'){
			$this->load->view('facturacion');
		}else{
			echo "Permiso restringido";
		}
	}
	public function invoiceRepetido(){
		$repetidos=$this->model->invoiceRe(); // numero de ordenes con invoice repetido
		$msg='';
		if (!empty($repetidos)) {
			foreach ($repetidos as $orden) {
				$msg .= "<br>Orden: ".$orden->invoice;
			}
		}
		return $msg; 
	}
	public function cg1TP(){
		$aux=$this->model->get_orderWithInvoice(); // numero de ordenes con TP asignado
		$msg='';
		if(!empty($aux)){
			foreach ($aux as $item){
				$msg .="<br>Orden $item->invoice, por favor verifique";	
			}
		}
		return $msg;
	}

	public function factura(){
		if($this->input->post('key')=='520ddW8'){
			// Valida si existe un invoice repetivo
			$vir=$this->invoiceRepetido();
			if (!empty($vir)) {
				$entrega["msgError"]='Ordenes Con tp Repetido'.$vir;
				$entrega["tipo"]=0;
				echo json_encode($entrega);
				die(); // mata facturacion por duplicados
			}

			$id=$this->input->post("id");
			$jsonFact=$this->input->post("jsonFact");
			$jsonFact2=json_encode($jsonFact);
			$this->fecha=$this->input->post("fc"); // fecha para facturar
			$caja = $this->input->post("caja"); // CAJA FACT
			$fact = $this->input->post("tp");  // TP FACT
			
			if( empty($this->fecha) or empty($caja) or empty($fact) ){ // si los datos del form estan vacios retorna ERROR y mata FACT
				$entrega["tipo"]=0;
				$entrega["msgError"].="Por favor diligencie todos los campos";
				echo json_encode($entrega);
				die();
			}
			// Validar si existe alguna orden estado 11 con TP
			if ($id==0){ 
				$aux=$this->cg1TP();
				if(!empty($aux)){
					$entrega["msgError"]='Ordenes Con Tp'.$aux;
					$entrega["tipo"]=0;
					echo json_encode($entrega);
					die();
				}
			}
			

			// 1 signfica enviar el JSON a CG1
			if ($id){
				$filename=date("Y-m-d-h-i-s").'.txt';
				$entrega["filename"]= $filename;
				
				file_put_contents('json_factura/'.$filename, json_decode($jsonFact2));
				//die();
				$vtpr=$this->TPRepetido(); // retorna 1 
				if($vtpr==0){
					$entrega["tipo"]=0;
					$entrega["msgError"]="OJO TP REPETIDO";
					echo json_encode($entrega);
					die();
				}
				//$filename = $this->input->post("fn");				
				$tt=file_get_contents('json_factura/'.$filename);
				//print_r($tt);
				$var2 = $this->enviarJson($tt);
				// enviar_email("contabilidad@eleganthomecolombia.com","Facturacion PAYU $fecha",$var);
				// enviar_email("admin@indicreativos.com","Facturacion PAYU $fecha",$var);
				// enviar_email("ttherrera30@gmail.com","Facturacion PAYU $fecha",$var);
				// $var2 = $this->enviarJson($json);	
				
			}else{
				$json = $this->generaJson($caja, $fact, 0);
				//print_r($json);
				
			}
			//return json_encode($entrega);
		}
	}
	public function generaJson($caja,$fact, $upd){
		$r1=0;
		$r2=0;
		$cantT=0;
		$n=0;
		
		$this->caja = $caja;
		$this->fact = $fact;
		
		$fecha = '';
		$items = array();
		$facturas = array();
		$entrega["facturas"] = array();
		
		$consulta=$this->model->consultarOrder($this->input->post('type')); // consulta todas las ordenes con estado 11
		if (!empty($consulta['data'])){
			$consulta2f=$this->model->ConsultarOrder_dd($consulta); // consulta todas las ordenes_d con estado 11
			//print_r($consulta2f);
			//die();
			$entrega["tipo"]=1;
			$entrega["msgError"]='';
			foreach ($consulta['data'] as $item){
				$cantT+=1;
				$this->caja = $this->caja + 1;
				$this->fact = $this->fact + 1;
				$a0='';
				if(strlen($this->caja) < 6){
					for ($i = 0;$i<(6-strlen($this->caja)); $i++) {
						$a0.='0';
					}
					$this->caja =$a0.$this->caja;
				}
				$pdcto = 0;
				$pdctovalor=0;
				$prueba = 0;
				if ($item->cupon>0){
					if ($item->cupon!=34 && $item->cupon!=35 && $item->cupon!=39 && $item->cupon!=37 && $item->cupon!=48 && $item->cupon!=49 && $item->cupon!=50){
						$cupon = $this->model->getCupon($item->cupon);
						if ($cupon["filas"] == 1){
							if ($cupon["data"]->type == 1){
								$pdcto = $cupon["data"]->value;
							}elseif($cupon["data"]->type == 2){
								$prueba=1;
								$pdctovalor = $cupon["data"]->value;
								
							}else{
								//print_r($cupon);
								$entrega["tipo"]=0;
								$entrega["msgError"].='$cupon Error tipo dcto $item->invoice';
								echo json_encode($entrega);
								die();
							}
						}else{
							$entrega["tipo"]=0;
							$entrega["msgError"].="Error cupon $item->invoice";
							echo json_encode($entrega);
							die();
						}
					}
				}else{
					if ($item->discountp>0){
						$pdcto = $item->discountp;
					}
				}
				
				// Llenamos recaudo th_orders
				$totalf = $item->total;
				// print_r($totalf);
				$total = round($totalf / 1.19,0);				
				$iva = $totalf-$total;
				// $fecha = $item->statusChange;
				$desC = $item->discountp;
				$numeroAA = number_format($iva, 0,'.','');
				$numeroA = number_format($iva);
				
				$fecha = substr($item->statusChange,0,10);
				$fechaaux = date_create($fecha);
				date_add($fechaaux, date_interval_create_from_date_string("1 days"));
				$fecha = date_format($fechaaux,"Y-m-d");
				
				/*$AgreCero = $numeroAA;*/
				if(strlen($numeroA) < 11){
					$a0='';
					for ($i = 0;$i<=(11-strlen($numeroA)); $i++) {
						$a0.='0';
					}
					/*$AgreCero =$a0.$numeroAA;*/
				}
				if($item->PaymentMethod == 101 && $item->enviopor == "Envia"){	
					$met_envio = '022';
				}else{
					$met_envio = $item->paymentCode;
				}
				$fecha=$this->fecha;
				$fech = substr($fecha, 0, -9 );
				$dafec = explode("-", $fecha);
				$agrdat = $dafec[0].$dafec[1].$dafec[2]; 
				$numeroB = number_format($totalf,0,'.','');
				$recaudo = array (
					'TIPO_REG' => '02',
					'FECHA' => $agrdat,
					'CO' => '018',
					'CAJA' => '01',
					'NTD_CAJA'=>$this->caja, //lo entregan
					'TIPO_REC'=>'3',
					'MEDPAG' => $met_envio,		
					'IND_IE'=>'I',
					'COD_BANCO'=>'',
					'NRO_CHE'=>'',
					'NRO_CTACTE'=>'',
					'FECHA_CON'=>'',
					'REFERENCIA'=>'THO',
					'NRO_CTAOTR'=>0,
					'VALOR_PROPINAS'=>0,
					'VALOR_IVA'=>0,
					'CTABAN'=>'1', // paula primero pruebas
					'NRO_CONSIGNACION'=>'1', // paula primero pruebas
					'COND_PAGO'=>'', // paula primero pruebas
					'TERC'=>'', // paula primero pruebas
					'SUC'=>'00',
					'VALOR'=>$numeroB,
					'VALOR_ME'=>0,
					'AUTORIZACION'=>'',
					'OBSERVACION'=>$item->invoice
					
				);
				$r1 += $numeroB;
				$acum=0;
				$vuelta=0;
				$bv=0;
				
				$factura["recaudo"] = $recaudo;
				//print_r($recaudo);
				// Cambiarlo a 1 sola consulta que traiga todo OJOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
				/*print_r($item->id);
				$Consulta2=$this->model->ConsultarOrder_d($item->id); // order_d de cada pedido
				print_r($Consulta2);*/
				if(empty($consulta2f['data'])){ // se puede declarar antes 
					$entrega["tipo"]=0;
					$entrega["msgError"].="$item->invoice";
					echo json_encode($entrega);
					die();
				}
				foreach ($consulta2f['data'] as $item2){ ///////////////////////////////////////////////// refacto
					$acum+=$item2->cant ;
				}
				// Si existe un cupon divido el valor del cupon en la cantidad de productos
				// newvalue lo que tiene es el descuento que tiene que pasarle al producto
				$newvalue=0;
				if(!isset($pdctovalor)){	
					//if($acum %  2 == 1 && $acum != 1){
						$newvalue=$pdctovalor/$acum;
						$newvalue=number_format($newvalue);
						$newvalue=str_replace(',','',$newvalue);
					//}
				}
				$items = array();
				$t2 = 0;
				
				foreach ($consulta2f['data'] as $item2){ //////////////////////////////////////////////// refacto
					if ($item2->order==$item->id) {
						//print_r($item2);
						//print_r($item);


						if ($item2->sku == "BODEGA_345" or $item2->sku == "BODEGA1_526"){
							$precioEsp = ($item2->value / $item2->cant) / 2;
							$item2->cant = $item2->cant * 2;
						}
						if ($item2->item == 608){
							$precioEsp = ($item2->value / $item2->cant) / 3;
							$item2->cant = $item2->cant * 3;
						}
						if (empty($item2->item)){
							$entrega["tipo"]=0;
							$entrega["msgError"].="Error cupon $item->invoice item vacio";
							echo json_encode($entrega);
							die();
						}
						//print_r($prueba);
						if ($pdcto > 0){
							// valor producto neto
							$VPN = $item2->value - ($item2->value * $pdcto / 100);
						}elseif($prueba > 0){////// refacto
							
							if ($acum == 1){
								$VPN = $item2->value-$pdctovalor;
							}elseif($acum % 2 == 0){
								if ($acum >= 10){
									$VPN = $item2->value-($pdctovalor/10);
								}elseif($n==0){
									$VPN = $item2->value-($pdctovalor/$acum);
								}
							}else{
								
								if ($acum >= 10){
									$VPN = $item2->value-($pdctovalor/10);
								}else{
									if ($vuelta==2){
										$VPN = $item2->value-$pdctovalor;
									}else{
										if($item2->cant > 1 ){ //////////////////////////
											if($item2->cant >= 2){ /////////////////// revisar aca
												if($bv==1){
													for ($i = 1; $i <= 2 ; $i++) {
														$VPN= $item2->value -$pdctovalor;
														$vuelta+=1;
													}
												}else{
													for ($i = 1; $i <= 2 ; $i++) {
														$VPN= $item2->value - ($newvalue*2);
														$pdctovalor=$pdctovalor-$newvalue;
														
														$vuelta+=1;
													}
												}
												if($vuelta==2 && $item2->cant >= 3){
													for ($i = 1; $i <= 1 ; $i++) {
														$VPN = $item2->value-$pdctovalor;
														$pdctovalor=$pdctovalor-$newvalue;
														$vuelta+=1;
													}
												}
											}else{
												for ($i = 1; $i <= 2 ; $i++) {
													$VPN = $item2->value-$newvalue;
													$pdctovalor=$pdctovalor-$newvalue;
													$vuelta+=1;
												}
											}
										}else{
											if(isset($newvalue)){
	
											}else{
												$newvalue=0;
											}
											$VPN = $item2->value-$newvalue;
											$pdctovalor=$pdctovalor-$newvalue;
											$vuelta+=1;
											$bv=1;
										}	
									}	
								}
							}
						}else{
							$VPN = $item2->value;
						}
						$VPN = round($VPN,0);
					$valPSiva = ($VPN / $item2->cant) / 1.19;
					$valPSiva = round($valPSiva,0);
					
					// Valor neto
					$VLRNET = $VPN;
					$a0='';
					if(strlen($VLRNET) < 11){
						for ($i = 0;$i<(11-strlen($VLRNET)); $i++) {
							$a0.='0';
						}
					}				
					$VLRNET = $a0.$VLRNET;
					// Valor iva
					$a0='';
					$VLRIVA = $VPN - ($valPSiva * $item2->cant);
					if(strlen($VLRIVA) < 9){
						for ($i = 0;$i<(9-strlen($VLRIVA)); $i++) {
							$a0.='0';
						}
					}
					$VLRIVA = $a0.$VLRIVA;
						
					$aux = array (
						'TIPO_REG' => '01',
						'FECHA' => $agrdat ,
						'CO'=>'018',
						'CAJA'=>'01',
						'NTD_CAJA'=>$this->caja, // lo entregan
						'TIPO_FC'=>'TP',
						'NRO_FC'=>$this->fact, // lo entregan
						'ITEMS'=>$item2->item, // revise 
						'EXTITM'=>'',
						'CANT_1'=>$item2->cant,
						'LIPRE'=>'014',
						'LIDES'=>'',
						'NRO_COMANDA'=>'',
						'PRECIO_UNI'=>number_format($valPSiva,0,'.',''),
						'VLRTOT_BRU'=>number_format($valPSiva*$item2->cant,0,'.',''),
						'DSCTO1'=>$pdcto, //trae bd //traido bd
						'VRLDES_LINEA1'=>0,
						'TASA_IVA'=> "1900",
						'VLRIVA'=>$VLRIVA,
						'VLRNET'=>$VLRNET,
						'MOTIVO'=>'01',
						'UNIMED_CAP'=>'',
						'FACTOR_CAP'=>0,
						'IND_ITEMS'=>'I',
						'CODBAR'=>'',
						'REFER'=>''
					);
					$r2 += $VLRNET;
					array_push($items, $aux);
					}
					
					
					
				}
				// Valor neto
				if ($pdcto > 0){
					//$VLRNET = $item->delivery - ($item->delivery * $pdcto / 100);
				}else{
					//$VLRNET = $item->delivery;
				}
				$VLRNET = $item->delivery;
				$a0='';
				if(strlen($VLRNET) < 11){
					for ($i = 0;$i<(11-strlen($VLRNET)); $i++) {
						$a0.='0';
					}
				}
				$valPSiva = round(($VLRNET) / 1.19,0);
				$VLRNET = $a0.$VLRNET;
				
				$VLRIVA = $VLRNET - ($valPSiva);
				$a0='';
				if(strlen($VLRIVA) < 9){
					for ($i = 0;$i<(9-strlen($VLRIVA)); $i++) {
						$a0.='0';
					}
				}
				$VLRIVA = $a0.$VLRIVA;
				
				$aux = array (
					'TIPO_REG' => '01',
					'FECHA' => $agrdat ,
					'CO'=>'018',
					'CAJA'=>'01',
					'NTD_CAJA'=>$this->caja, // lo entregan
					'TIPO_FC'=>'TP',
					'NRO_FC'=>$this->fact, // lo entregan
					'ITEMS'=>"900002", // revise 
					'EXTITM'=>'',
					'CANT_1'=>1,
					'LIPRE'=>'014',
					'LIDES'=>'',
					'NRO_COMANDA'=>'',
					'PRECIO_UNI'=>number_format($valPSiva,0,'.',''),
					'VLRTOT_BRU'=>number_format($valPSiva,0,'.',''),
					'DSCTO1'=>$pdcto, //trae bd //traido bd
					'VRLDES_LINEA1'=>0,
					'TASA_IVA'=> "1900",
					'VLRIVA'=>$VLRIVA,
					'VLRNET'=>$VLRNET,
					'MOTIVO'=>'01',
					'UNIMED_CAP'=>'',
					'FACTOR_CAP'=>0,
					'IND_ITEMS'=>'I',
					'CODBAR'=>'',
					'REFER'=>''
				);		
				array_push($items, $aux);
				$r2 += $VLRNET;
					
				$factura["items"] = $items;			
				array_push($facturas, $factura);	
				if ($upd==0){
					if($item->cg1_fact==0){
						$this->model->update_orden(
							array(
								'invoice' => $item->invoice,
								'cg1_fact' => $this->fact,
								'cg1_caja' => $this->caja,
								'fact_lim' => 1,
								'created_fact'=>$fecha
							)				
						);
					}else{
						$entrega["tipo"]=0;
						$entrega["msgError"].="Orden $item->invoice ya cuenta con la factura $item->cg1_fact <br><br><br>";
						echo json_encode($entrega);
						die();
					}
				}
				if($r1 != $r2){
					$entrega["tipo"]=0;
					$entrega["msgError"].="$item->invoice Diferente <br><br><br> R1: ".$r1." <br> R2: ".$r2." <br><br>";
					echo json_encode($entrega);
					die();
				}
			}
			$entrega["msg"]= "cant: $cantT <br><br> R1: $r1 <br> R2: $r2 <br><br>";
			$entrega['total']=$cantT;
			$entrega["r1"]=$r1;
			$entrega["r2"]=$r2;
			$entrega['caja']=$this->caja;
			$entrega['fact']=$this->fact;
			// $data["msg"]="<P>cant: $cantT </p><br> <p>R1: $r1 </p><br><p> R2: $r2 </p><br>";
			// $entrega['dat'] = $data;
			// $entrega['tipo'] =1;
			$entrega["facturas"]= $facturas;
			/*if($entrega["tipo"]==1){
				$filename=date("Y-m-d-h-i-s").'.txt';
				$entrega["filename"]= $filename;
				//file_put_contents('json_factura/'.$filename, json_encode($entrega));
				
			}*/
			echo json_encode($entrega) ;
		}else{
			$entrega["tipo"]=0;
			$entrega['finlp']=1;	
			$entrega["msgError"]="NO data para facturar ";
			echo json_encode($entrega);
			die();
		}

	}
	public function fff(){
		$tt=file_get_contents('json_factura/'.'2022-05-17-08-31-47.txt');
				//print_r($tt);
		$this->enviarJson($tt);
	}

	public function ttt(){
		// echo date('m',strtotime('-1 month'));
		die();
		$filename="2022-03-31-02-35-57.txt";
		$tt=file_get_contents('json_factura/'.$filename);
		// print_r($tt);
		$var2 = $this->enviarJson($tt);
	}
	public function enviarJson($json){
		$url = "http://192.168.10.100:8080/Api.atlas/rest/factura/pdv";
		$url = "http://190.156.238.155:8080/Api.atlas/rest/factura/pdv";
		$ch = curl_init( $url );
		# Setup request to send json via POST.
		$payload = $json;
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
		curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
		# Return response instead of printing.
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		# Send request.
		$result = curl_exec($ch);
		if($result === false)
		{
			$dato["tipo"] = 0;
			$dato["msgerr"] = 'Curl error: ' . curl_error($ch);
		}else{
			$dato["tipo"]=1;
			$dato["finlp"]=1;
			$dato["msgok"] = $this->input->post("msg");
			$dato['json'] = $json;
		}
		echo json_encode($dato);
	}
	public function getconsecutivo(){
		$url = "http://192.168.10.100:8080/Api.atlas/rest/factura/consecutivos/";
		$ch = curl_init();
		// Set query data here with the URL
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 3);
		$content = trim(curl_exec($ch));
		curl_close($ch);	
		return json_encode($content);
	}
	
	public function TPRepetido(){
		$pasa=1;
		$entrega["tipo"]=1;
		$entrega["msgError"]='';
		$todo=$this->model->consultarOrder2($this->input->post('type'));// consulta todas las ordenes con estado 11 param type = fin mes o fact normal
		//print_r($todo['data'] );
		foreach($todo['data'] as $item){
			$valida=$this->model->TPRe($item->cg1_fact); // numero de ordenes con TP 
			if($valida==1){
				
			}else{
				$entrega["tipo"]=0;
				$entrega["msgError"].= "Factura $item->cg1_fact duplicada <br>";
				echo json_encode($entrega);
				die();
			}
		}
		return $pasa;
		//print_r($todo);
		// if($todo['filas']==0){
			// return 1;
		// }else{
			// foreach ($todo['data'] as $item2){
				// echo "repetido  ".$item2->cg1_fact."<br/>";
			// }
			// return 0;
		// }
	}
	
	////////////////////////////////////*** Para revisión diaria
	public function dia($fecha='',$CO='')
	{
		if(!empty($fecha) and !empty($CO)){
			$fecha2=substr($fecha,0,4)."-".substr($fecha,4,2)."-".substr($fecha,6,2);
			$cg1 = $this->model->get_VentasCg1($fecha,$CO);
			$txt='';
			if(isset($cg1)){
				foreach ($cg1 as $reg){
					$total = explode(".",$reg->TOTAL);
					$txt.="(
						'$reg->DOCUMENTO_FC',
						'$total[0]',
						'$fecha2'
					),";
				}
				$aux=substr($txt,0,(strlen($txt)-1));
				$r=$this->model->save_cg1($aux,$fecha2);
				if($r>0){
					$sistema = $this->model->get_VentasSistma($fecha);
					$txt='';
					foreach ($sistema as $reg){
						$txt.="(
							'$reg->cg1_fact',
							'$reg->invoice',
							'$reg->total',
							'$reg->PaymentMethod',
							'$reg->track',
							'$fecha2'
						),";
					}
					$aux=substr($txt,0,(strlen($txt)-1));
					$r=$this->model->save_sistema($aux,$fecha2);
					if($r>0){
						$this->model->validardia($fecha2);
						$this->validardia($fecha2);
					}else{
						echo "Error al grabar informacióon del sistema";
					}
				}else{
					echo "No se ha acumulado";
				}
			}else{
				echo "Sin datos o No se ha acumulado";
			}
		}
	}
	public function validardia($fecha2){
		$dato=$this->model->get_totales($fecha2);
		if($dato["cg1"] == $dato["sis"]){
			echo "Venta ok <br/>";
		}else{
			echo "Valores de venta no coinciden <br/>";
			$this->table->set_heading(
				'LUGAR', 
				'VALOR'
			);
			$this->table->add_row(
				"<b>CG1</b>",
				number_format($dato["cg1"],0,',','.')
			);
			$this->table->add_row(
				"<b>SISTEMA</b>",
				number_format($dato["sis"],0,',','.')
			);
			$this->table->add_row(
				"<b>DIFERENCIA</b>",
				number_format($dato["cg1"]-$dato["sis"],0,',','.')
			);
			echo $this->table->generate();
			
			echo "<h1>Diferencias CG1</h1>";
			$this->table->set_heading(
					'DOCUMENTO_FC', 
					'TOTAL',
					'rev1 #FACT',
					'rev2 VAL',
					'OBS',
					''
			);
			$info=$this->model->get_diferencias_cg1($fecha2);
			$totald=0;
			foreach($info as $item){		
				$this->table->add_row(
					$item->DOCUMENTO_FC,
					number_format($item->TOTAL,0,',','.'),
					$item->rev1,
					$item->rev2,
					$item->OBS,
					"<a href='http://192.168.0.208/backTHO/index.php/facturacion/comentar/c/$fecha2/$item->Id'>Comentar</a>"
				);
				$totald += $item->TOTAL;
			}
			$this->table->add_row(
				'',
				$totald,
				'',
				'',
				'',
				''
			);
			echo $this->table->generate();
			
			echo "<h1>Diferencias Sistema</h1>";
			$this->table->set_heading(
				'cg1_fact', 
				'total',
				'rev1 #FACT',
				'rev2 VAL',
				'invoice',
				'PaymentMethod',
				'track',
				'OBS',
				''
			);
			$info=$this->model->get_diferencias_sistema($fecha2);
			if(isset($info)){
				$totald=0;
				foreach($info as $item){		
					$this->table->add_row(
						$item->cg1_fact,
						number_format($item->total,0,',','.'),
						$item->rev1,
						$item->rev2,
						$item->invoice,
						$item->PaymentMethod,
						$item->track,
						$item->OBS,
						"<a href='http://192.168.0.208/backTHO/index.php/facturacion/comentar/s/$fecha2/$item->Id'>Comentar</a>"
					);
					$totald += $item->total;
				}
				$this->table->add_row(
					'',
					$totald,
					'',
					'',
					'',
					'',
					'',
					'',
					''
				);
				echo $this->table->generate();
			}else{
				echo "No muestra diferencias";
			}
		}
	}
	public function comentar($tipo,$fecha,$id){
		?>
		<form method='post' action='<?=site_url("facturacion/comentars")?>'>
			<input type='hidden' name='tipo' value='<?=$tipo?>'>
			<input type='hidden' name='fecha' value='<?=$fecha?>'>
			<input type='hidden' name='id' value='<?=$id?>'>
			<textarea name='comment' required></textarea><br>
			<input type='submit'>
		</form>
		<?
	}
	public function comentars(){
		$tipo=$this->input->post('tipo');
		$fecha=$this->input->post('fecha');
		$id=$this->input->post('id');
		$comment=$this->input->post('comment');
		$array=array(
			"Id"=>$id,
			"OBS"=>$comment
		);
		$this->model->updateOBS($array,$tipo);
		header("Location: ".site_url("facturacion/validardia/$fecha"));
		exit();
	}
}