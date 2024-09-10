precision highp float;

uniform vec2 dimensions;
uniform float aspect;
uniform sampler2D texture;
uniform float timeSinceStart;

const float EPSILON = .1;
const vec3 light = vec3(0.0, 1000.0, .0);
const vec3 cameraOrigin = vec3(256.0, 5.0, 280.0);
const int iterations = 80;
const float heightmapResolution = 512.0;
float sphere(vec3 point, float radius);
float sceneSDF(vec3 point);
vec3 getNormal(vec3 point);
void main() {

    float speed = 3.0;
    //put into range -1..1
    vec3 cameraPosition = cameraOrigin + vec3(.0,0.1,1.0)*(timeSinceStart/1000.0)*speed;

    vec3 fragmentCoord = vec3(gl_FragCoord.xy, 1);
    fragmentCoord.xy = (fragmentCoord.xy / dimensions) * 2.0 - 1.0;
    vec3 rayDirection = normalize(fragmentCoord);
    float depth = 1.0;
    vec3 point = (cameraPosition + rayDirection * depth);
    vec3 closestHit = vec3(100.0);
    vec4 outputColor = vec4(0.0, 0.6, 0.99, 1.0);

    float maxDepth = 256.0;
    vec4 heightmapSample = texture2D(texture, point.xz / heightmapResolution);
    for(int i = 0; i < iterations; i++) {
        point = (cameraPosition + rayDirection * depth);
        vec2 heightmapUV = point.xz / heightmapResolution;
        heightmapSample = texture2D(texture, heightmapUV);
        float distanceTravelled = point.y - heightmapSample.x * 10.0;
        depth += distanceTravelled;
        //We're close enough to count as a hit, but we need to use our last heightmapsample as color;

        if(depth >= maxDepth) //we went too far and didn't get close to anything
            break;
        if(distanceTravelled < .0001) {
            heightmapSample.a = 1.0;
            outputColor = heightmapSample;
            break;
        }

        if(i == iterations - 1) {
            heightmapSample.a = 1.0;
            outputColor = heightmapSample;
            break;
        }

    }
    gl_FragColor = outputColor;
}

// vec3 getNormal(vec3 point) {
//     return normalize(vec3(sceneSDF(vec3(point.x + EPSILON, point.y, point.z)) - sceneSDF(vec3(point.x - EPSILON, point.y, point.z)), sceneSDF(vec3(point.x, point.y + EPSILON, point.z)) - sceneSDF(vec3(point.x, point.y - EPSILON, point.z)), sceneSDF(vec3(point.x, point.y, point.z + EPSILON)) - sceneSDF(vec3(point.x, point.y, point.z - EPSILON))));
// }
