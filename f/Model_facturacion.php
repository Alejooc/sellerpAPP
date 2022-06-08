<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Model_facturacion extends CI_Model {
	private $table_Voip = 'prueba';
	private $table_Order = 'th_orders';
	private $table_Productos = 'th_products_d';
	private $table_Detalle_Orden = 'th_orders_d';
	private $table_Cliente = 'th_clients';
	private $table_Clientes_Direcccion = 'th_clients_a';
	private $table_Ciudad = 'th_lo_citys';
	private $table_Departamento = 'th_lo_states';
	private $table_Estado = 'th_orders_state';
	private $table_Metodo_Pago = 'th_orders_pm';
	
	function consultarOrder($tipo){
		$this->db->select('a.cg1_caja, a.cg1_fact, a.id, a.invoice, a.PaymentMethod, a.enviopor, a.delivery, mepa.paymentCode, a.discountp, a.subtotal, a.total, a.send, a.statusChange, a.delivery, a.cupon ');
		$this->db->from('th_orders a'); 
		$this->db->join($this->table_Metodo_Pago.' mepa','`mepa`.`id` = a.PaymentMethod');
		if($tipo==2){
			$mes = date('m',strtotime('-1 month'));
			$this->db->where("a.created <= '2022-$mes-31 23:59:59'","",false);
		}			
		$this->db->where("a.state",11);
		$this->db->where("a.fact_lim",0);
		$this->db->limit(50);
		$this->db->order_by('a.id','DESC');
		$consulta = $this->db->get();		
		if($consulta->num_rows()>0){
			$datos["filas"] = $consulta->num_rows();
			$datos["data"] = $consulta->result();
		}else{
			$datos["filas"] = 0;
		}
		return $datos;
	}
	function consultarOrder2($tipo){
		$this->db->select('a.cg1_caja, a.cg1_fact, a.id, a.invoice, a.PaymentMethod, a.enviopor, a.delivery, mepa.paymentCode, a.discountp, a.subtotal, a.total, a.send, a.statusChange, a.delivery, a.cupon ');
		$this->db->from('th_orders a'); 
		$this->db->join($this->table_Metodo_Pago.' mepa','`mepa`.`id` = a.PaymentMethod');
		if($tipo==2){
			$mes = date('m',strtotime('-1 month'));
			$this->db->where("a.created <= '2022-$mes-31 23:59:59'","",false);
		}			
		$this->db->where("a.state",11);
		//$this->db->where("a.fact_lim",0);
		//$this->db->limit(50);
		$this->db->order_by('a.id','DESC');
		$consulta = $this->db->get();		
		if($consulta->num_rows()>0){
			$datos["filas"] = $consulta->num_rows();
			$datos["data"] = $consulta->result();
		}else{
			$datos["filas"] = 0;
		}
		return $datos;
	}
	function ConsultarOrder_dd($id){	
		$this->db->select('a.cant, a.value,a.order, pro.item, pro.product, pro.sku');
		$this->db->from('th_orders_d a');
		$this->db->join($this->table_Productos.' pro','a.product = pro.id');
		$this->db->join('th_orders b','a.order = b.id');
		$this->db->where("b.state",11);
		$this->db->where("b.fact_lim!=1");
		$consulta = $this->db->get();
		if($consulta->num_rows()>0){
			$datos["filas"] = $consulta->num_rows();
			$datos["data"] = $consulta->result();
		}else{
			$datos["filas"] = 0;
		}
		return $datos;
	}
	function ConsultarOrder_d($id){		
		$this->db->select('a.cant, a.value, pro.item, pro.product, pro.sku');
		$this->db->from('th_orders_d a');
		$this->db->join($this->table_Productos.' pro','a.product = pro.id');
		$this->db->where("a.order = $id");
		$consulta = $this->db->get();
		if($consulta->num_rows()>0){
			$datos["filas"] = $consulta->num_rows();
			$datos["data"] = $consulta->result();
		}else{
			$datos["filas"] = 0;
		}
		return $datos;
	}
	function limpiarTP(){
		$this->db->set(array("cg1_fact"=>0,"cg1_caja"=>0));
        $this->db->where('state', 11);
        $this->db->update('th_orders');
		return $this->db->error();
	}
	function get_orderWithInvoice(){
		$this->db->select('cg1_fact,invoice, count(cg1_fact) as total');
		$this->db->from('th_orders');
		$this->db->where('cg1_fact>',0);
		$this->db->where('state',11);
		$this->db->where('fact_lim',0);
		$this->db->group_by('invoice');
		$consulta = $this->db->get();		
		if($consulta->num_rows()>0){
			return $consulta->result();
		}
	}
	function TPRe($cg1_fact){
		$this->db->select('count(cg1_fact) as nn, cg1_fact');
		$this->db->from('th_orders');
		$this->db->where('cg1_fact',$cg1_fact);
		$this->db->group_by('cg1_fact');
		$consulta = $this->db->get();		
		if($consulta->num_rows()>0){
			return $consulta->row()->nn;
		}else{
			return 0;
		}
	}
	function invoiceRe(){
		$this->db->select('count(*) as total, invoice');
		$this->db->from('th_orders');
		$this->db->where('invoice = invoice');
		$this->db->where('state',11);
		$this->db->where('fact_lim',0);
		$this->db->group_by('invoice');
		$this->db->having('count(*)>1');
		$consulta = $this->db->get();		
		if($consulta->num_rows()>0){
			return $consulta->result();
		}
	}
	
	function getCupon($id){
		// print_r($user);
		$this->db->select('`a`.`type`, `a`.`value`');
		$this->db->from('th_products_cupon a'); 
		$this->db->where("a.id = $id");
		$this->db->limit(1);
		$consulta = $this->db->get();
		if($consulta->num_rows()>0){
			$datos["filas"] = $consulta->num_rows();
			$datos["data"] = $consulta->row();
		}else{
			$datos["filas"] = 0;
		}
		return $datos;
	}
	function update_orden($array) {
        $this->db->set($array);
        $this->db->where('invoice', $array['invoice']);
        $this->db->update('th_orders');
		return $this->db->error();
    }
	function ExcelOrder(){
		$this->db->select("*");
		$this->db->from("th_orders");
		$this->db->where("state",11);
		$this->db->where("PaymentMethod<>",101);
		$consulta = $this->db->get();		
		if($consulta->num_rows()>0){
			$datos["filas"] = $consulta->num_rows();
			$datos["data"] = $consulta->result();
		}else{
			$datos["filas"] = 0;
		}
		return $datos;
	}
	/////////////////////////////////////////////////////////* Revisión diaria
	function get_VentasCg1($fecha,$CO){
		$DBARIS = $this->load->database('biable',TRUE);
		$DBARIS->select('`DOCUMENTO_FC`,SUM( VEN_NETAS) as TOTAL');
		$DBARIS->from('MOVIMIENTO_PDV');
		$DBARIS->where('FECHA_DCTO',$fecha);
		$DBARIS->where('ID_CO',$CO);
		$DBARIS->GROUP_BY('DOCUMENTO_FC');
		$consulta = $DBARIS->get();		
		if ($consulta->num_rows() > 0) {
			return $consulta->result();
		}
	}
	function get_VentasSistma($fecha){
		$DBARIS = $this->load->database('default',TRUE);
		$DBARIS->select('invoice,cg1_fact,total,track,PaymentMethod');
		$DBARIS->from('th_orders');
		$DBARIS->where('date(`th_orders`.`created_fact`)',$fecha);
		$consulta = $DBARIS->get();		
		if ($consulta->num_rows() > 0) {
			return $consulta->result();
		}
	}
	function save_cg1($aux,$fecha){
		$this->db->query("delete from th_rev_cg1 where FECHA = '$fecha'");
		$this->db->query("INSERT INTO th_rev_cg1 (DOCUMENTO_FC,TOTAL,FECHA) VALUES $aux");
		return $this->db->affected_rows();
	}
	function save_sistema($aux,$fecha){
		$this->db->query("delete from th_rev_sistema where FECHA = '$fecha'");
		$this->db->query("INSERT INTO th_rev_sistema (cg1_fact,invoice,total,PaymentMethod,track,fecha) VALUES $aux");
		return $this->db->affected_rows();
	}
	function get_totales($fecha2){
		$this->db->select("sum(TOTAL) as TOTAL");
		$this->db->from("th_rev_cg1");
		$this->db->where("FECHA",$fecha2);
		$dato["cg1"]=$this->db->get()->row()->TOTAL;
		
		$this->db->select("sum(total) as TOTAL");
		$this->db->from("th_rev_sistema");
		$this->db->where("fecha",$fecha2);
		$dato["sis"]=$this->db->get()->row()->TOTAL;
		
		return $dato;
	}
	function validardia($fecha){
		$this->db->query("UPDATE th_rev_sistema,th_rev_cg1 SET th_rev_sistema.rev1=1 WHERE th_rev_sistema.cg1_fact=th_rev_cg1.DOCUMENTO_FC AND th_rev_sistema.fecha = '$fecha';");
		$this->db->query("UPDATE th_rev_sistema,th_rev_cg1 SET th_rev_sistema.rev2=1 WHERE th_rev_sistema.cg1_fact=th_rev_cg1.DOCUMENTO_FC AND th_rev_sistema.fecha = '$fecha' AND th_rev_sistema.total=th_rev_cg1.TOTAL;");
		$this->db->query("UPDATE th_rev_sistema,th_rev_cg1 SET th_rev_cg1.rev1=1 WHERE th_rev_sistema.cg1_fact=th_rev_cg1.DOCUMENTO_FC AND th_rev_sistema.fecha = '$fecha';");
		$this->db->query("UPDATE th_rev_sistema,th_rev_cg1 SET th_rev_cg1.rev2=1 WHERE th_rev_sistema.cg1_fact=th_rev_cg1.DOCUMENTO_FC AND th_rev_sistema.fecha = '$fecha' AND th_rev_sistema.total=th_rev_cg1.TOTAL;");
		return $this->db->affected_rows();
	}
	function get_diferencias_cg1($fecha){
		$this->db->from("th_rev_cg1");
		$this->db->group_start();
		$this->db->where("rev1",NULL);
		$this->db->or_where("rev2",NULL);
		$this->db->group_end();
		$this->db->where("FECHA",$fecha);
		$consulta = $this->db->get();		
		if ($consulta->num_rows() > 0) {
			return $consulta->result();
		}
	}
	function get_diferencias_sistema($fecha){
		$this->db->from("th_rev_sistema");
		$this->db->group_start();
		$this->db->where("rev1",NULL);
		$this->db->or_where("rev2",NULL);
		$this->db->group_end();
		$this->db->where("fecha",$fecha);
		$consulta = $this->db->get();		
		if ($consulta->num_rows() > 0) {
			return $consulta->result();
		}
	}
	function updateOBS($array,$tipo){
		$this->db->set($array);
		$this->db->where('Id', $array['Id']);
		if($tipo=='c'){
			$this->db->update("th_rev_cg1");
		}
		if($tipo=='s'){
			$this->db->update("th_rev_sistema");
		}
		
	}
}