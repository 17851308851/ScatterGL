#version 460 core
layout (location = 0) out vec4 FragColor;
layout (location = 1) out vec4 normalColor;
layout (location = 2) out vec4 positionColor;

in vec3 FragmentPosition;
in vec3 Normal;
in vec2 texCoords;

struct Material
{
	sampler2D diffuse;
	sampler2D specular;
	float shine; 
};

struct DirectionalLight
{
	vec3 direction;
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
};

struct PointLight
{
    vec3 position;

    float constant;
    float linear;
    float quadratic;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform bool isModel;
uniform sampler2D texture_diffuse1;
uniform vec3 viewPosition;
uniform Material material;

uniform DirectionalLight light;
//uniform PointLight pointLight;
//uniform int numberOfPointLights;

#define NR_POINT_LIGHTS 4  
uniform PointLight pointLights[NR_POINT_LIGHTS];

vec3 calcDirLight(DirectionalLight dirLight, vec3 normal, vec3 viewDir)
{
    vec3 lightDir = normalize(-dirLight.direction);
    //diffuse calculation
    float diff = max(dot(normal, lightDir), 0.0);
    //specular calculation
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shine);
    //combine results
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    if(isModel)
    {
        ambient = dirLight.ambient * vec3(texture(texture_diffuse1, texCoords));
        diffuse = dirLight.diffuse * diff * vec3(texture(texture_diffuse1, texCoords));
        specular = dirLight.specular * spec * vec3(texture(texture_diffuse1, texCoords));
    }
    else
    {
        ambient = dirLight.ambient * vec3(texture(material.diffuse, texCoords));
        diffuse = dirLight.diffuse * diff * vec3(texture(material.diffuse, texCoords));
        specular = dirLight.specular * spec * vec3(texture(material.specular, texCoords));
    }
    return (ambient + diffuse + specular);

}

float calcPointLight(PointLight pointje, vec3 normal, vec3 fragPos, vec3 viewDir)
{

    vec3 lightDir = normalize(pointje.position - fragPos);
    //diffuse calculations
    float diff = max(dot(normal, lightDir), 0.0);
    //specularity calculations
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shine);
    // attenuation calculation
    float dist = length(pointje.position - fragPos);
    float attenuation = 1.0 / (pointje.constant + pointje.linear * dist + pointje.quadratic *
                        dist * dist);
    // combining result
    return (attenuation);
    
}

void main()
{
    vec3 outPut = vec3(0.0f);
    normalColor = vec4(Normal, 1.0f);
    positionColor = vec4(FragmentPosition, 1.0f);
    if(isModel)
    {
        FragColor = texture(texture_diffuse1, texCoords);
        if(FragColor.a <0.5)
        {
            discard;
        }
    }
    //ambient light
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, texCoords));
    //diffuse lighting
    vec3 norm = normalize(Normal);
    float diff = max(dot(norm, -light.direction), 0.0);
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, texCoords));

    //specular lighting
    vec3 viewDirection = normalize(viewPosition - FragmentPosition);
    vec3 reflectDirection = reflect(light.direction, norm);
    float spec = pow(max(dot(viewDirection, reflectDirection), 0.0), material.shine);
    vec3 specular = light.specular * spec * vec3(texture(material.specular, texCoords));

    //point light calculations
    // float distanceToSourceLight = length(pointLight.position - FragmentPosition);
    // float attenuation = 1.0 / (pointLight. constant + pointLight.linear * distanceToSourceLight + 
    //                         pointLight.quadratic * (distanceToSourceLight * distanceToSourceLight));
    float atten;
    for(int i = 0; i < NR_POINT_LIGHTS; i++)
    {
       //atten += calcPointLight(pointLights[i], Normal, FragmentPosition, viewDirection);
    }
    //combining results
    ambient  *= 1 + atten; 
    diffuse  *= 1 + atten;
    specular *= 1 + atten;
    vec3 result = diffuse + ambient + specular;
    FragColor = vec4(result, 1.0f);

}