#pragma once

#include "pch.h"

namespace ScatterGL
{
class Framebuffer
{
public:
	unsigned int fbo;
	unsigned int colorTexture;
	unsigned int postProcessTexture;
	unsigned int depthTexture;
	unsigned int shadowTexture;
	unsigned int normalTexture;
	unsigned int positionTexture;

	

	void initialize(int width, int height);
	void bind();
	void unbind();
	void resizeFramebuffer(int width, int height, unsigned int tmpTexture);
	void attachTexture(unsigned int texture);
	void destroy();
};
}