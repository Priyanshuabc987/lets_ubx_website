
import { useMemo, useRef, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useDeleteHeroImage, useHeroImages, useUpdateHeroOrder, useUploadHeroImage } from '@/hooks/useHero';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';
import { Delete, Upload, GripVertical, Loader2, Save } from 'lucide-react';
import { HeroItem } from '@/lib/types';

function DraggableGridItem({ item, index, onDelete }: { item: HeroItem; index: number; onDelete: () => void; }) {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="w-full md:w-[calc(25%-1rem)] justify-center py-2 group"
        >
          <div className={`relative w-[80%] aspect-[7/6] rounded-lg overflow-hidden border-2 transition-all ${
            snapshot.isDragging ? 'border-primary shadow-2xl scale-110 z-50' : 'border-transparent'
          }`}>
            <ImageWithFallback
              src={item.url}
              alt={item.caption || `Hero image ${index + 1}`}
              fill
              className="object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            <span className="absolute bottom-1 left-2 text-white font-bold text-sm drop-shadow-md">
              {index + 1}
            </span>

            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }} 
                  className="h-6 w-6"
                >
                  <Delete className="h-3 w-3" />
                </Button>
            </div>

            <div 
              {...provided.dragHandleProps} 
              className="absolute top-1 left-1 cursor-grab p-1 rounded-md bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-foreground/80" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export function HeroManagement() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: allItems, isLoading } = useHeroImages();
  const uploadMutation = useUploadHeroImage();
  const deleteMutation = useDeleteHeroImage();
  const updateOrderMutation = useUpdateHeroOrder();

  const sortedItems = useMemo(() => allItems?.sort((a, b) => a.display_order - b.display_order) ?? [], [allItems]);

  const [orderedItems, setOrderedItems] = useState<HeroItem[]>([]);

  useEffect(() => {
    setOrderedItems(sortedItems);
  }, [sortedItems]);

  const isOrderChanged = useMemo(() => {
    return JSON.stringify(sortedItems.map(p => p.id)) !== JSON.stringify(orderedItems.map(p => p.id));
  }, [sortedItems, orderedItems]);

  const handleFileUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast({ title: 'No file selected', description: 'Please choose a file to upload.', variant: 'destructive' });
      return;
    }
    uploadMutation.mutate(file, {
        onSuccess: () => toast({ title: 'Upload Successful', description: 'Your image has been added to the hero section.' })
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (item: HeroItem) => {
    if (window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      deleteMutation.mutate({ id: item.id, url: item.url }, {
          onSuccess: () => toast({ title: 'Image Deleted', description: 'The hero image has been removed.' })
      });
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(orderedItems);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);
    setOrderedItems(items);
  };

  const handleSaveOrder = () => {
    const orderedIds = orderedItems.map(item => item.id);
    updateOrderMutation.mutate(orderedIds, {
        onSuccess: () => toast({ title: 'Order Saved', description: 'The new hero image order has been applied.' })
    });
  };  

  const handleCancelOrder = () => {
    setOrderedItems(sortedItems);
    toast({ title: 'Order Reset', description: 'The display order has been reset.' });
  };

  const DroppableGridSection = ({ items }: { items: HeroItem[] }) => (
    <div className="pt-6 mt-6 border-t">
        {items.length === 0 ? (
            <p className="text-muted-foreground text-sm">No hero images found.</p>
        ) : (
            <Droppable droppableId="hero-images" direction="horizontal">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-4 gap-4 px-auto">
                  {items.map((item, index) => (
                      <DraggableGridItem key={item.id} item={item} index={index} onDelete={() => handleDelete(item)} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
        )}
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
          <CardHeader><CardTitle>Upload New Hero Image</CardTitle></CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
              <Input type="file" ref={fileInputRef} className="max-w-xs" accept="image/*" />
              <Button onClick={handleFileUpload} disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload Image
              </Button>
          </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Hero Images</CardTitle>
          <CardDescription>Drag and drop images to reorder them visually.</CardDescription>
        </CardHeader>
        <CardContent>
          {isOrderChanged && (
            <div className="flex justify-start items-center gap-4 p-4 rounded-md bg-secondary mb-4 sticky top-16 z-10">
                <p className="text-sm font-medium">You have unsaved changes.</p>
                <Button size="sm" onClick={handleSaveOrder} disabled={updateOrderMutation.isPending}>
                    {updateOrderMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Order
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancelOrder} disabled={updateOrderMutation.isPending}>Cancel</Button>
            </div>
          )}

          {isLoading ? <p>Loading images...</p> : (
            <DragDropContext onDragEnd={onDragEnd}>
                <DroppableGridSection items={orderedItems} />
            </DragDropContext>
          )}

          {!isLoading && allItems?.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
                <p className="text-muted-foreground">No hero images found. Upload an image to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
