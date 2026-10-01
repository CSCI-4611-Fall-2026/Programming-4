/* Programming 4
 * CSCI 4611, Fall 2026, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class App extends gfx.GfxApp
{
    private ground: gfx.Mesh3;

    private sphere: gfx.Mesh3;
    private sphereVelocity: gfx.Vector3;

    private cameraControls: gfx.FirstPersonControls;

    // --- Create the App class ---
    constructor()
    {
        // Initialize the base class gfx.GfxApp
        super();

        this.ground = gfx.Geometry3Factory.createBox(10, 1, 10);
        this.sphere = gfx.Geometry3Factory.createSphere(0.5, 3);
    
        this.cameraControls = new gfx.FirstPersonControls(this.camera);
    
        this.sphereVelocity = new gfx.Vector3();
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        // Setup the camera projection matrix and position.
        // We will learn more about camera models later in this course.
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 100);
        
        // Note that in a right-handed coordinate system, the camera looks down the -z axis.
        // The camera is positioned 1.5m above the ground and 10m in the +z direction,
        // so that an object placed at the origin 
        // will be visible in the camera's view.
        this.camera.position.set(0, 1.5, 5);

        // Create an ambient light that illuminates everything in the scene
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.3, 0.3, 0.3));

        // Create a directional light that is infinitely far away (sunlight)
        const directionalLight = new gfx.DirectionalLight(new gfx.Color(0.6, 0.6, 0.6));
        directionalLight.position.set(1, 2, 1);

        // A Gouraud material is a type of material that uses per-vertex lighting.
        // It produces less realistic results than per-pixel lighting, but is more computationally efficient.
        const groundMaterial = new gfx.GouraudMaterial();
        groundMaterial.texture = new gfx.Texture("./PavingStones070_2K-JPG_Color.jpg");

        // Set the position of the ground to be 0.5m below the origin, so that the top of the ground is at y=0.
        this.ground.position.set(0, -.5, 0);
        this.ground.material = groundMaterial;

        // A Phong material is a type of material that uses per-pixel lighting.
        // It is more computationally expensive than per-vertex lighting, but it produces more realistic results.
        const sphereMaterial = new gfx.PhongMaterial();
        sphereMaterial.texture = new gfx.Texture("./Marble012_1K-JPG_Color.jpg");
        sphereMaterial.setColor(new gfx.Color(0, 1.25, 1.25));
        
        // Set the initial velocity of the sphere to be 10 m/s in +y direction. 
        // This is known as an impulse, which is a sudden change in velocity
        // that occurs over a very short period of time.
        this.sphere.position.set(0, 1, 0);
        this.sphere.material = sphereMaterial;

        // Set the initial velocity of the sphere to be 10 m/s in +y direction. 
        // This is known as an impulse, which is a sudden change in velocity
        // that occurs over a very short period of time.
        this.sphereVelocity.set(0, 8, 0);

        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
        this.scene.add(this.ground);
        this.scene.add(this.sphere);
    }

    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        // Set acceleratation in m per sec^2.
        // 9.8 m/s^2 is the acceleration due to gravity on Earth.
        const sphereAcceleration = new gfx.Vector3(0, -9.8, 0); 

        // v_new = v_old + a * dt
        const a_dt = gfx.Vector3.multiplyScalar(sphereAcceleration, deltaTime);
        this.sphereVelocity.add(a_dt);

        // p_new = p_old + v_new * dt
        const v_dt = gfx.Vector3.multiplyScalar(this.sphereVelocity, deltaTime);
        this.sphere.position.add(v_dt);

        // If the sphere falls through the ground then reset to its initial state
        // This is not the same thing as computing a correct bounce.
        // We will learn about collision detection and response next week.
        if(this.sphere.position.y < -0.5)
        {
            this.sphere.position.set(0, 1, 0);
            this.sphereVelocity.set(0, 8, 0);
        }

        // The camera controls need to be called in the update loop.
        // They require deltaTime to compute the camera movement
        // using a consistent translation and rotation speed.
        this.cameraControls.update(deltaTime);
    }
}