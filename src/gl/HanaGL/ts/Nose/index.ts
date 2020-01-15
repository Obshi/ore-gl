import * as THREE from 'three';
import * as ORE from 'ore-three-ts';
import { Blood } from './Blood';



export class Nose extends THREE.Object3D{

	private renderer: THREE.WebGLRenderer;

	private time: number = 0;

	private wireNose: THREE.Mesh;
	private meshNose: THREE.Mesh;

	private leftPoint: THREE.Object3D;
	private rightPoint: THREE.Object3D;

	private blood: Blood;

	private animator: ORE.Animator;

	private commonUniforms: ORE.Uniforms;
	private meshUniforms: ORE.Uniforms;
	private wireUniforms: ORE.Uniforms;

	constructor( renderer: THREE.WebGLRenderer, gltfScene: THREE.Scene ){

		super();

		this.renderer = renderer;

		
		this.animator = new ORE.Animator();

		this.craeteObjects( gltfScene );

	}

	private craeteObjects( gltfScene: THREE.Scene ){

		/*-------------------------
			Mesh
		--------------------------*/
		
		this.meshNose = ( gltfScene.getObjectByName( 'Nose' ) as THREE.Mesh ).clone();
		this.meshNose.material = new THREE.ShaderMaterial({
		});

		this.animator.addVariable('opacity', 0.0 );
		this.animator.animate( 'opacity', 1.0, 3 );

		this.animator.addVariable('pos', 1 );
		this.animator.animate('pos', 0 );

		this.add( this.meshNose );

		/*-------------------------
			Wire
		--------------------------*/

		this.wireNose = ( gltfScene.getObjectByName( 'Nose' ) as THREE.Mesh ).clone();
		this.wireNose.scale.set( 1.01, 1.01, 1.01 );
		this.wireNose.material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframe: true,
			transparent: true,
		});

		this.add( this.wireNose );

		/*-------------------------
			Positions
		--------------------------*/

		this.rightPoint = ( this.meshNose.getObjectByName( 'splash_right' ) as THREE.Mesh );
		this.leftPoint = ( this.meshNose.getObjectByName( 'splash_left' ) as THREE.Mesh );


		/*-------------------------
			Blood
		--------------------------*/

		this.blood = new Blood( this.renderer );
		this.meshNose.add( this.blood );

	}

	public update( deltaTime: number ){

		this.time += deltaTime;

		this.blood.update( deltaTime );

		this.animator.update( deltaTime );
		
		(this.meshNose.material as THREE.MeshStandardMaterial).opacity = this.animator.getValue('opacity');
		(this.wireNose.material as THREE.MeshStandardMaterial).opacity = this.animator.getValue('opacity');

	}

	public splash( pos: THREE.Vector3 ){

		this.blood.splash( pos );

	}

	public heal(){

		this.blood.heal( );

	}

	public updateFingerPos( fingerPos: THREE.Vector3 ){

		let lenRight = new THREE.Vector3().subVectors( fingerPos, this.rightPoint.getWorldPosition( new THREE.Vector3() ) ).length();
		let lenLeft = new THREE.Vector3().subVectors( fingerPos, this.leftPoint.getWorldPosition( new THREE.Vector3() ) ).length();

		let spl = false;

		if( lenRight < 0.2 ){

			this.splash( this.rightPoint.position );
			spl = true;

		}

		if( lenLeft < 0.2 ){

			this.splash( this.leftPoint.position );
			spl = true;

		}

		if( !spl ){

			this.heal();

		}

		return spl;
		
	}
}